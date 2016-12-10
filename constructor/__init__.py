from pyramid.config import Configurator
from pyramid.security import Allow, Deny
from pyramid.security import Everyone
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy

class ConstructorFactory(object):
    def __init__(self, request):
        self.__acl__ = [
            (Allow, 'dailybook_admin', 'change_constructor'),
            (Allow, 'dailybook_admin', 'view_admin_page')
        ]

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    authn_policy = AuthTktAuthenticationPolicy('seekrit', hashalg='sha512')
    authz_policy = ACLAuthorizationPolicy()
    config = Configurator(settings=settings, root_factory=ConstructorFactory)
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)
    config.include('.models')
    config.include('pyramid_sqlalchemy')
    config.include('pyramid_jinja2')
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('index', '/')
    config.add_route('signin', '/signin')
    config.add_route('login', '/login')
    config.add_route('admin', '/admin')
    config.add_route('logout', '/logout')
    config.add_route('save_settings', '/save_settings')
    config.scan('.views')
    return config.make_wsgi_app()
