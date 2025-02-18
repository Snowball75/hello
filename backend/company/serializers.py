from rest_framework import serializers
from .models import CompanyIncorporation, DirectorsInformation, AuthorizedAndPaidUpCapital, ShareHoldersInformation



class DirectorsInformationSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(queryset=CompanyIncorporation.objects.all())
    class Meta:
        model = DirectorsInformation
        fields = '__all__'
        # fields = [
        #     'company',
        #     'director_first_name',
        #     'director_middle_name',
        #     'director_last_name',
        #     'father_first_name',
        #     'father_middle_name',
        #     'father_last_name',
        #     'gender',
        #     'date_of_birth',
        #     'nationality',
        #     'education',
        #     'address1',
        #     'address2',
        #     'city',
        #     'state',
        #     'pincode',
        #     'proof_address',
        #     'proof_address_file',
        #     'email',
        #     'phone_number',
        #     'pan_number',
        #     'pan_number_file',
        #     'aadhar_card_number',
        #     'aadhar_card_file',
        #     'din',
        #     'din_number',
        #     'details_of_existing_directorships',
        #     'existing_company_name',
        #     'existing_cin',
        #     'existing_type_of_company',
        #     'existing_position_herd',
        #     'existing_date',
        #     'passport_size_photo',
        #     'dsc',
        #     'role_in_the_company',
        #     'director_also_shareholder',
        #     'no_of_shares',
        #     'percentage_of_holdings',
        #     'paid_up_cash_contribution',
        # ]

class ShareholderInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShareHoldersInformation
        fields = '__all__'
        # fields = [
        #     'company',
        #     'type_of_shareholder',
        #     'shareholder_first_name',
        #     'shareholder_last_name',
        #     'entity_name',
        #     'cin_number',
        #     'authorised_representative',
        #     'email',
        #     'phone_number',
        #     'percentage_of_holding',
        #     'address1',
        #     'address2',
        #     'city',
        #     'state',
        #     'pincode',
        #     'pan_card_file',
        #     'proof_address',
        #     'proof_address_file',
        #     'bank_statement_file',
        #     'board_resolution',
        # ]

class AuthorizedAndPaidUpCapitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthorizedAndPaidUpCapital
        fields = '__all__'
        # fields = [
        #     'company',
        #     'authorised_share_capital',
        #     'paid_up_share_capital',
        #     'face_value_per_share',
        #     'number_of_shares',
        # ]


class CompanyIncorporationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyIncorporation
        fields = '__all__'

        # fields = [
        #     'company_type',
        #     'proposed_company_name1',
        #     'proposed_company_name2',
        #     'proposed_company_name3',
        #     'business_objective',
        #     'business_activity',
        #     'nic_code',
        #     'address1',
        #     'address2',
        #     'ownership_type',
        #     'city',
        #     'state',
        #     'pincode',
        #     'utility_bill',
        #     'noc',
        #     'rental_agreement',
        #     'property_tax_receipt'
        # ]

