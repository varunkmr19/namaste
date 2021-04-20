from collections import namedtuple
from os import name
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('user/<user_id>', views.account_view, name='account'),
    path('user/<user_id>/edit', views.edit_account_view, name='edit_account'),
    path('user/<user_id>/edit/cropImage', views.crop_image, name='crop_image'),
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register_view, name='register'),
    path('search', views.account_search_view, name='search'),

    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(
        template_name='account/password_reset/password_change_done.html'), name='password_change_done'),

    path('password_change/', auth_views.PasswordChangeView.as_view(
        template_name='account/password_reset/password_change.html'), name='password_change'),

    path('password_reset/done/', auth_views.PasswordResetCompleteView.as_view(
        template_name='account/password_reset/password_reset_done.html'), name='password_reset_done'),

    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),

    path('password_reset/', auth_views.PasswordResetView.as_view(),
         name='password_reset'),

    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(
        template_name='account/password_reset/password_reset_complete.html'), name='password_reset_complete'),
]
