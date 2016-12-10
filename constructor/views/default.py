from mimetypes import guess_extension, guess_type
from collections import OrderedDict
import json
import os
import base64
import re

from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound, HTTPForbidden
from pyramid.security import forget, remember
from pyramid.response import Response
from sqlalchemy.exc import DBAPIError

from ..models import User


@view_config(route_name='index', renderer='../templates/index.jinja2', request_method='GET')
def index_page(request):
    return {}


@view_config(route_name='signin', renderer='../templates/signin.jinja2', request_method='GET')
def signin_page(request):
    if not request.unauthenticated_userid:
        return {}
    else:
        if request.GET.get('next') != None:
            return HTTPFound(location=request.GET.get('next'))
        else:
            return HTTPFound(location="/")


@view_config(route_name='login', request_method='POST')
def login(request):
    next_page = request.params.get('next')
    if next_page == None:
        next_page = "/"
    login = request.POST.get('login')
    password = request.POST.get('password')
    try:
        user = request.dbsession.query(User).filter(User.login == login).first()
    except DBAPIError:
        return Response("", content_type='text/plain', status=500)
    if user and user.validate_password(password):
        headers = remember(request, login)
        return HTTPFound(location=next_page,
                         headers=headers)

    message = 'Not valid login or password'
    return Response(message)


@view_config(route_name='admin', renderer='../templates/admin_page.jinja2', request_method='GET')
def admin_page(request):
    if request.unauthenticated_userid:
        if request.has_permission('view_admin_page'):
            return {}
        else:
            return HTTPForbidden()
    else:
        return HTTPFound(location=request.route_url('signin', _query={'next': 'admin'}))


@view_config(route_name='logout')
def logout(request):
    headers = forget(request)
    return HTTPFound(location='/',
                     headers=headers)


@view_config(route_name='save_settings', permission='change_constructor', request_method='POST')
def save_constructor_changes(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode, object_pairs_hook=OrderedDict)
    new_json_data = body['config']
    with open('constructor/static/customization.json') as json_data:
        old_json_data = json.load(json_data, object_pairs_hook=OrderedDict)
        modify_textures_folder(new_json_data, old_json_data)
        modify_stitches_folder(new_json_data, old_json_data)
        del new_json_data["LoadedMaps"]
        del new_json_data["RemovedMaps"]
    with open('constructor/static/customization.json', "w") as json_data:
        json_data.write(json.dumps(new_json_data, ensure_ascii=False))
    scene_json = body['scene']
    if scene_json != {}:
        with open('constructor/static/dailybook.babylon', 'w') as scene_data:
            scene_data.write(json.dumps(scene_json, ensure_ascii=False))
    message = "success"
    return Response(message)


def modify_textures_folder(new_json_data, old_json_data):
    for loaded_texture in new_json_data["LoadedTextures"]:
        if loaded_texture in old_json_data["Texture"]:
            filename = old_json_data["Texture"][loaded_texture]["Texture filename"]
            if (filename != old_json_data["Default texture"]):
                os.remove("constructor/static/images/textures/" + filename)
        base64Data = new_json_data["LoadedTextures"][loaded_texture]["Base64"]
        new_filename = loaded_texture + guess_extension(guess_type(base64Data)[0])
        with open("constructor/static/images/textures/" + new_filename, "wb") as fh:
            base64Data = re.sub(r"data:image/\w+?;base64,", "", base64Data)
            fh.write(base64.b64decode(base64Data))
            new_json_data["Texture"][loaded_texture]["Texture filename"] = new_filename
    for removed_texture_filename in new_json_data["RemovedTextures"]:
        os.remove("constructor/static/images/textures/" + removed_texture_filename)


def modify_stitches_folder(new_json_data, old_json_data):
    for stitchType in new_json_data["LoadedMaps"]:
        for object in new_json_data["LoadedMaps"][stitchType]:
            if stitchType in old_json_data["Parameters"]["Stitch"]["Type"] and \
                            object in old_json_data["Parameters"]["Stitch"]["Type"][stitchType]["Objects"]:
                filename = old_json_data["Parameters"]["Stitch"]["Type"][stitchType]["File by object"][object]
                if (filename != old_json_data["Default stitch map"]):
                    os.remove("constructor/static/images/stitches/" + filename)
            base64Data = new_json_data["LoadedMaps"][stitchType][object]["Base64"]
            new_filename = stitchType + "_" + object + guess_extension(guess_type(base64Data)[0])
            with open("constructor/static/images/stitches/" + new_filename, "wb") as fh:
                base64Data = re.sub(r"data:image/\w+?;base64,", "", base64Data)
                fh.write(base64.b64decode(base64Data))
                new_json_data["Parameters"]["Stitch"]["Type"][stitchType]["File by object"][object] = new_filename
    for removedFile in new_json_data["RemovedMaps"]:
        os.remove("constructor/static/images/stitches/" + removedFile)
