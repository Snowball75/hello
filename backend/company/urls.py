from django.urls import path
from .views import submit_company_details, submit_directors_info, submit_authorized_and_paid_up_capital, submit_shareholder_info, get_all_company_data, update_company_data, delete_company

urlpatterns = [
    path('submit-company/', submit_company_details, name='submit_company_details'),
    path('submit-directors/', submit_directors_info, name='submit_directors_info'),
    path('submit-shareholders/',submit_shareholder_info,name='submit_shareholder_info'),
    path('submit-paid-up/',submit_authorized_and_paid_up_capital, name='submit_authorized_and_paid_up_capital'),
    path('company-data/', get_all_company_data, name='get_all_company_data'),
    path('company-data/<company_id>/', update_company_data, name='update_company_data'),
    path('company-data/<str:company_id>/', delete_company, name='delete_company'),
]
