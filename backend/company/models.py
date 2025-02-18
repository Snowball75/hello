from django.core.validators import MinValueValidator, MaxValueValidator
from djongo import models
import os


def upload_to_basic_details(instance, filename):
    return os.path.join('uploads/basic_details', instance.proposed_company_name1, filename)
def upload_to_director_information(instance, filename):
    return os.path.join('uploads/directors', instance.director_first_name, filename)
def upload_to_shareholder_information(instance, filename):
    if instance.type_of_shareholder == 'individual':
        return os.path.join('uploads/shareholders/individual', instance.shareholder_first_name, filename)
    else:
        return os.path.join('uploads/shareholders/company', instance.entity_name, filename)



class CompanyIncorporation(models.Model):
    Select_company_type = [
        ('private limited', 'Private Limited Company'),
        ('sole proprietorship', 'Solo Proprietorship'),
        ('llp', 'LLP'),
        ('public limited', 'Public Limited Company'),
        ('section8', 'Section 8 Company'),
        ('one person', 'One-Person Company'),
        ('partnership', 'Partnership'),
        ('any other', 'Any Other')
    ]
    Business_Activity = [
        ('a', 'A'),
        ('b', 'B'),
        ('c', 'C'),
        ('d', 'D'),
        ('e', 'E'),
    ]
    Ownership_type = [
        ('ownership1', 'Ownership1'),
        ('ownership2', 'Ownership2'),
        ('ownership3', 'Ownership3')
    ]
    company_type = models.CharField(max_length=30, choices=Select_company_type)
    proposed_company_name1 = models.CharField(max_length=60, unique=True)
    proposed_company_name2 = models.CharField(max_length=60, blank=True, null=True)
    proposed_company_name3 = models.CharField(max_length=60, blank=True, null=True)
    business_objective = models.TextField()
    business_activity = models.CharField(max_length=30, choices=Business_Activity,blank=True, null=True)
    nic_code = models.PositiveIntegerField(blank=True, null=True)
    address1 = models.TextField(max_length=100,blank=True, null=True)
    address2 = models.TextField(blank=True, null=True)
    ownership_type = models.CharField(max_length=30, choices=Ownership_type)
    city = models.CharField(max_length=30, blank=True, null=True)
    state = models.CharField(max_length=30, blank=True, null=True)
    pincode = models.PositiveIntegerField(blank=True, null=True)
    utility_bill = models.FileField(upload_to=upload_to_basic_details, blank=True, null=True)
    noc = models.FileField(upload_to=upload_to_basic_details, blank=True, null=True)
    rental_agreement = models.FileField(upload_to=upload_to_basic_details, blank=True, null=True)
    property_tax_receipt = models.FileField(upload_to=upload_to_basic_details, blank=True, null=True)

    def __str__(self):
        return str(self.id)


class AuthorizedAndPaidUpCapital(models.Model):
    company = models.ForeignKey(CompanyIncorporation,
                                on_delete=models.CASCADE,related_name="capital_details")
    authorised_share_capital = models.DecimalField(max_digits=15, decimal_places=2)
    paid_up_share_capital = models.DecimalField(max_digits=15, decimal_places=2)
    face_value_per_share = models.DecimalField(max_digits=10, decimal_places=2)
    number_of_shares = models.PositiveIntegerField()

    def __str__(self):
        return f"Capital Details for {self.company.id}"


class ShareHoldersInformation(models.Model):
    Type_of_Shareholder = [
        ('individual', 'Individual'),
        ('company', 'Company'),
    ]
    Proof_Address = [
        ('aadhar card', 'Aadhar Card'),
        ('voter id', 'Voter ID'),
        ('passport', 'Passport'),
        ('driving license', 'Driving License'),
        ('utility bill', 'Utility Bill')
    ]
    company = models.ForeignKey(CompanyIncorporation, on_delete=models.CASCADE, related_name="shareholders_details")
    type_of_shareholder = models.CharField(max_length=10, choices=Type_of_Shareholder)
    shareholder_first_name = models.CharField(max_length=30, blank=True, null=True)
    shareholder_last_name = models.CharField(max_length=30, blank=True, null=True)
    entity_name = models.CharField(max_length=30, blank=True, null=True)
    cin_number = models.CharField(max_length=30, blank=True, null=True)
    authorised_representative = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.PositiveIntegerField(blank=True, null=True)
    percentage_of_holding = models.DecimalField(max_digits=10, decimal_places=2)
    address1 = models.TextField(blank=True, null=True)
    address2 = models.TextField(blank=True)
    city = models.CharField(max_length=30, blank=True, null=True)
    state = models.CharField(max_length=30, blank=True, null=True)
    pincode = models.PositiveIntegerField(blank=True, null=True)
    pan_card_file = models.FileField(upload_to=upload_to_shareholder_information, blank=True, null=True)
    proof_address = models.CharField(max_length=30, choices=Proof_Address, blank=True, null=True)
    proof_address_file = models.FileField(upload_to=upload_to_shareholder_information, blank=True, null=True)
    bank_statement_file = models.FileField(upload_to=upload_to_shareholder_information, blank=True, null=True)
    board_resolution = models.FileField(upload_to=upload_to_shareholder_information, blank=True, null=True, default=None)
    def __str__(self):
        return f"Shareholder Details for {self.company.id}"


class DirectorsInformation(models.Model):
    Gender =[
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ]
    Nationality =[('indian', 'Indian'),
                  ('not a indian', 'Not a Indian'),]
    Education_qualification = [
        ('no formal education', 'No Formal Education'),
        ('primary education', 'Primary Education'),
        ('secondary education', 'Secondary Education'),
        ('bachelor degree', 'Bachelor Degree'),
        ('master degree', 'Master Degree'),
        ('high education', 'High Education')
    ]
    Proof_Address = [
        ('aadhar card', 'Aadhar Card'),
        ('voter id', 'Voter ID'),
        ('passport', 'Passport'),
        ('driving license', 'Driving License'),
        ('utility bill', 'Utility Bill')
    ]
    Radio = [
        ('yes', 'Yes'),
        ('no', 'No'),
    ]
    company = models.ForeignKey(CompanyIncorporation, on_delete=models.CASCADE, related_name="directors")
    director_first_name = models.CharField(max_length=60)
    director_middle_name = models.CharField(max_length=60,blank=True,null=True)
    director_last_name = models.TextField(max_length=60)
    father_first_name = models.CharField(max_length=60)
    father_middle_name = models.CharField(max_length=60,blank=True,null=True)
    father_last_name = models.CharField(max_length=60)
    gender = models.CharField(max_length=30, choices=Gender)
    date_of_birth = models.DateField()
    nationality = models.CharField(max_length=30, choices=Nationality)
    education = models.CharField(max_length=30, choices=Education_qualification)
    address1 = models.TextField()
    address2 = models.TextField(blank=True)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=30)
    pincode = models.PositiveIntegerField()
    proof_address = models.CharField(max_length=30, choices=Proof_Address)
    proof_address_file = models.FileField(upload_to=upload_to_director_information)
    email = models.EmailField()
    phone_number = models.PositiveIntegerField()
    pan_number = models.CharField(max_length=30)
    pan_number_file = models.FileField(upload_to=upload_to_director_information)
    aadhar_card_number = models.BigIntegerField()
    aadhar_card_file = models.FileField(upload_to=upload_to_director_information)
    din = models.CharField(max_length=30, choices=Radio)
    din_number = models.CharField(max_length=30, blank=True, null=True)
    details_of_existing_directorships = models.CharField(max_length=30, choices=Radio)
    existing_company_name = models.CharField(max_length=60, blank=True, null=True)
    existing_cin = models.CharField(max_length=60, blank=True, null=True)
    existing_type_of_company = models.CharField(max_length=30, blank=True, null=True)
    existing_position_herd = models.CharField(max_length=30, blank=True, null=True)
    existing_date = models.CharField(max_length=30, blank=True, null=True)
    passport_size_photo = models.FileField(upload_to=upload_to_director_information)
    dsc = models.CharField(max_length=30, choices=Radio)
    role_in_the_company = models.CharField(max_length=30)
    director_also_shareholder = models.CharField(max_length=30, choices=Radio)
    no_of_shares = models.PositiveIntegerField()
    percentage_of_holdings = models.DecimalField(max_digits=15, decimal_places=2)
    paid_up_cash_contribution = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return self.company





