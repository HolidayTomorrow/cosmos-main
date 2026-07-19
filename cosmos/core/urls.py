"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LogoutView, LoginView
from two_factor.urls import urlpatterns as tf_urls
from two_factor.admin import AdminSiteOTPRequired
from django.views.generic import RedirectView
from .views import CustomSetupView

admin.site.__class__=AdminSiteOTPRequired


from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/', views.home_view, name='home'),
    path('', RedirectView.as_view(url='/account/login/', permanent=False)),
    # path('account/two_factor/setup', CustomSetupView.as_view(), name='setup'),

    # Rota de login
    path('login', LoginView.as_view(), name='login'),

    # Rota de logout
    path('logout/', LogoutView.as_view(), name='logout'),

    path('', include(tf_urls)),
    # Rotas internas da biblioteca two_factor (Setup, QRCode, etc) colocadas em /accounts/
    # --- ESTA É A FORMA CORRETA E 100% FUNCIONAL ---
    # O Django 6.0 aceita isso sem reclamar do namespace, 
    # e a biblioteca two_factor entende essa string perfeitamente.
    # path('', include(tf_urls)),
    path('i18n/', include('django.conf.urls.i18n')),
]