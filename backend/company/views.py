from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.core.files.temp import NamedTemporaryFile
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from .models import CompanyIncorporation, DirectorsInformation, ShareHoldersInformation, AuthorizedAndPaidUpCapital
from .serializers import (CompanyIncorporationSerializer, DirectorsInformationSerializer,
                          AuthorizedAndPaidUpCapitalSerializer, ShareholderInformationSerializer)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_company_details(request):
    try:
        data = {
            'company_type': request.data.get('company_type'),
            'proposed_company_name1': request.data.get('proposed_company_name1'),
            'proposed_company_name2': request.data.get('proposed_company_name2'),
            'proposed_company_name3': request.data.get('proposed_company_name3'),
            'business_objective': request.data.get('business_objective'),
            'business_activity': request.data.get('business_activity'),
            'nic_code': request.data.get('nic_code'),
            'address1': request.data.get('address1'),
            'address2': request.data.get('address2', ''),
            'ownership_type': request.data.get('ownership_type'),
            'city': request.data.get('city'),
            'state': request.data.get('state'),
            'pincode': request.data.get('pincode'),
            'utility_bill': request.FILES.get('utility_bill'),
            'noc': request.FILES.get('noc'),
            'rental_agreement': request.FILES.get('rental_agreement'),
            'property_tax_receipt': request.FILES.get('property_tax_receipt'),
        }
        serializer = CompanyIncorporationSerializer(data=data)

        if serializer.is_valid():
            company = serializer.save()
            company_id = str(company.id)

            print(company_id)

            request.session['company_id'] = company_id
            request.session.modified = True

            data = {"message": "Company data saved successfully",
                "company_id": str(company.id)}

            # return Response({
            #     "message": "Company data saved successfully",
            #     "company_id": str(company.id)  # Ensure company_id is a string
            # }, status=status.HTTP_201_CREATED)
            return Response(data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_all_company_data(request):
    try:
        # Fetch all companies
        companies = CompanyIncorporation.objects.all()

        # Create structured response
        response_data = []

        for company in companies:
            company_id = company.id

            directors = DirectorsInformation.objects.filter(company=company_id).count()
            shareholders = ShareHoldersInformation.objects.filter(company=company_id).count()
            capital = AuthorizedAndPaidUpCapital.objects.filter(company=company_id)

            # Serialize the data
            company_data = CompanyIncorporationSerializer(company).data
            # directors_data = DirectorsInformationSerializer(directors, many=True).data
            # shareholders_data = ShareholderInformationSerializer(shareholders, many=True).data
            capital_data = AuthorizedAndPaidUpCapitalSerializer(capital, many=True).data

            # Append to response list
            response_data.append({
                "company": company_data,
                "directors": directors,
                "shareholders": shareholders,
                "capital": capital_data
            })

        return JsonResponse(response_data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(['PUT'])
def update_company_data(request, company_id):
    try:
        company = CompanyIncorporation.objects.get(id=company_id)
        serializer = CompanyIncorporationSerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)
    except CompanyIncorporation.DoesNotExist:
        return JsonResponse({"error": "Company not found"}, status=404)

@api_view(['DELETE'])
def delete_company(request, company_id):
    try:
        if request.method == 'DELETE':
            company = CompanyIncorporation.objects.get(id=company_id) # Delete the company record
            company.delete()

            return JsonResponse({"message": "Company and related data deleted successfully"},
                                status=status.HTTP_204_NO_CONTENT)

    except CompanyIncorporation.DoesNotExist:
        return JsonResponse({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_shareholder_info(request):
    try:
        sharehlders_data = request.data.copy()

        if sharehlders_data is None:
            return Response({"error": "Directors data is required"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ShareholderInformationSerializer(data=sharehlders_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def submit_authorized_and_paid_up_capital(request):
    try:
        data = request.data.copy()
        serializer = AuthorizedAndPaidUpCapitalSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_directors_info(request):
    try:
        directors_data = request.data.copy()

        if directors_data is None:
            return Response({"error": "Directors data is required"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = DirectorsInformationSerializer(data=directors_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )