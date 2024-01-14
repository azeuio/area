import 'dart:convert';

import 'package:area_mobile/dto/service_dto.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;

Future<List<ServiceDto>?> getServices(String backendUrl) async {
  try {
    List<ServiceDto> services = [];

    http.Response response = await http.get(
      Uri.parse('$backendUrl/services'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to get services');
    }
    Map<String, dynamic> json = jsonDecode(response.body);
    json.forEach((key, value) {
      value['id'] = key;
      services.add(ServiceDto.fromJson(value));
    });
    return services;
  } catch (error) {
    return null;
  }
}

Future<List<ServiceDto>?> getActiveServices(User? user, String backendUrl) async {
  if (user == null) {
    return null;
  }
  try {
    List<ServiceDto> services = [];
    String userToken = await user.getIdToken() as String;

    http.Response response = await http.get(
      Uri.parse('$backendUrl/services/active'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $userToken',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to get services');
    }
    for (var service in jsonDecode(response.body)) {
      services.add(ServiceDto.fromJson(service));
    }
    return services;
  } catch (error) {
    return null;
  }
}

Future<ServiceDto?> getService(String backendUrl, String serviceId) async {
  try {
    http.Response response = await http.get(
      Uri.parse('$backendUrl/services/$serviceId'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to get service');
    }
    Map<String, dynamic> serviceJson = jsonDecode(response.body);

    serviceJson['id'] = serviceId;
    return ServiceDto.fromJson(serviceJson);
  } catch (error) {
    return null;
  }
}
