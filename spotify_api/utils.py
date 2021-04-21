from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
import os

CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']

def fetch_user_tokens(session_key):
    user_tokens = SpotifyToken.objects.filter(user=session_key) # user is identified using their session key
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_or_create_user_tokens(session_key, refresh_token, access_token, expires_in, token_type):
    tokens = fetch_user_tokens(session_key)
    #tokens is just a model object

    # the default is for expires_in to be 3600 seconds aka an hour
    # should store the actual time that aligns with rather than '3600'
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    # timedelta allows us to do math with time objects

    if tokens:
        tokens.refresh_token = refresh_token
        tokens.access_token = access_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['refresh_token', 'access_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_key, access_token=access_token, refresh_token=refresh_token, expires_in=expires_in,
        token_type=token_type)

        tokens.save()

# need a way to checke if given user is authenticated

def is_authenticated(session_key):
    tokens = fetch_user_tokens(session_key)
    if tokens:
        expiration_time = tokens.expires_in
        if expiration_time <= timezone.now():
            refresh_tokens(tokens)
            
    return False

def refresh_tokens(tokens):
    refresh_token = tokens.refresh_token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type' : 'refresh_token',
        'refresh_token' : refresh_token,

    })