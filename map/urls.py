from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from . import views
from django.views.generic.base import RedirectView

urlpatterns = [

    path('admin/', admin.site.urls),  # Admin Panel
    path('map/', views.index)

]