// ignore_for_file: avoid_print

import 'dart:convert';

import 'package:area_mobile/constants.dart';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';

Future<User?> getCurrentUser() async {
  try {
    return FirebaseAuth.instance.currentUser;
  } catch (error) {
    print(error);
    return null;
  }
}

Future<Map<String, dynamic>?> getUserData(User? user) async {
  if (user == null) {
    return null;
  }
  try {
    String userToken = await user.getIdToken() as String;
    http.Response response = await http.get(
      Uri.parse('${AppConstants.apiUrl}/users'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $userToken',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to get user data');
    }
    return (json.decode(response.body));
  } catch (error) {
    print(error);
    return null;
  }
}
