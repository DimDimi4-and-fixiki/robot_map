from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include

urlpatterns = [
    path(r'^admin/', admin.site.urls),
    url('', include('map.urls'))
]
