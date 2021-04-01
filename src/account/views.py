from django.http.response import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.conf import settings

from account.models import Account
from account.forms import RegistrationForm, LoginForm

def register_view(request, *args, **kwargs):
  user = request.user
  if user.is_authenticated:
    return HttpResponse(f'You are already authenticated as {user.email}.')
  context = {}

  if request.POST:
    form = RegistrationForm(request.POST)
    if form.is_valid():
      form.save()
      email = form.cleaned_data.get('email').lower()
      raw_password = form.cleaned_data.get('password1')
      account = authenticate(email=email, password=raw_password)
      login(request, account)
      destination = get_redirect_if_exists(request)
      if destination:
        return redirect(destination)
      return redirect('home')
    else:
      context['registration_form'] = form

  return render(request, 'account/register.html', context)

def login_view(request, *args, **kwargs):
  context = {}

  user = request.user
  if user.is_authenticated:
    return redirect('home')
  
  if request.POST:
    form = LoginForm(request.POST)
    if form.is_valid():
      email = form.cleaned_data.get('email')
      password = form.cleaned_data.get('password')
      user = authenticate(email=email, password=password)
      if user:
        login(request, user)
        destination = get_redirect_if_exists(request)
        if destination:
          return redirect(destination)
        return redirect('home')
    else:
      context['login_form'] = form
  return render(request, 'account/login.html', context)

def get_redirect_if_exists(request):
  redirect = None
  if request.GET:
    if request.GET.get('next'):
      redirect = str(request.GET.get('next'))
  return redirect

def logout_view(request):
  logout(request)
  return redirect('home')

def account_view(request, *args, **kwargs):
  context = {}
  user_id = kwargs.get('user_id')
  try:
    account = Account.objects.get(pk=user_id)
  except Account.DoesNotExist:
    return HttpResponse('That user doesn\'t exist.')
  if account:
    context['id'] = account.id
    context['username'] = account.username
    context['email'] = account.email
    context['hide_email'] = account.hide_email
    context['profile_image'] = account.profile_image.url

    # Define state template variables
    is_self = True
    is_friend = False
    user = request.user
    if user.is_authenticated and user != account:
      is_self = False
    elif not user.is_authenticated:
      is_self = False

    context['is_self'] = is_self
    context['is_friend'] = is_friend
    context['BASE_URL'] = settings.BASE_URL

    return render(request, 'account/account.html', context)

def account_search_view(request, *args, **kwargs):
  context = {}

  if request.method == 'GET':
    search_query = request.GET.get('q')
    if len(search_query) > 0:
      search_results = Account.objects.filter(email__icontains=search_query).filter(username__icontains=search_query).distinct()
      accounts = []
      for account in search_results:
        accounts.append((account, False))
      context['accounts'] = accounts

  return render(request, 'account/search_results.html', context)