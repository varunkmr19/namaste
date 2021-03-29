from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate
from account.models import Account

class RegistrationForm(UserCreationForm):
  email = forms.EmailField(max_length=255, help_text='Required. Add a valid email address.')

  class Meta:
    model = Account
    fields = ('email', 'username', 'password1', 'password2')

  def clean_email(self):
    email = self.cleaned_data['email'].lower()
    try:
      account = Account.objects.get(email=email)
    except Exception as e:
      return email
    raise forms.ValidationError(f"Email {email} is alreday in use.")
  
  def clean_username(self):
    username = self.cleaned_data['username'].lower()
    try:
      account = Account.objects.get(username=username)
    except Exception as e:
      return username
    raise forms.ValidationError(f"username {username} is alreday in use.")

class LoginForm(forms.ModelForm):
  password = forms.CharField(label="Password", widget=forms.PasswordInput)

  class Meta:
    model = Account
    fields = ('email', 'password')