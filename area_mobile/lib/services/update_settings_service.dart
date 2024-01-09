import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;
import 'package:area_mobile/views/register_view.dart';

enum UpdateSettingStatus { updated, error, notUpdated }

bool isSignedWithPassword(User? user) {
  if (user == null) {
    return false;
  }
  List<UserInfo> providerData = user.providerData;

  for (var i = 0; i < providerData.length; i++) {
    if (providerData[i].providerId == 'password') {
      return true;
    }
  }
  return false;
}

Future<UpdateSettingStatus> tryUpdateUsername(String backendUrl, String userToken,
  String actualUsername, String newUsername) async {
  if (newUsername == '' || newUsername == actualUsername) {
    return UpdateSettingStatus.notUpdated;
  }
  try {
    http.Response response = await http.patch(
      Uri.parse('$backendUrl/users/'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $userToken',
      },
      body: jsonEncode(<String, String>{
        'username': newUsername,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to update username');
    }
    return UpdateSettingStatus.updated;
  } catch (error) {
    return UpdateSettingStatus.error;
  }
}

Future<UpdateSettingStatus> tryUpdateEmail(String backendUrl, String userToken,
  String actualEmail, String newEmail) async {
  if (newEmail == '' || newEmail == actualEmail) {
    return UpdateSettingStatus.notUpdated;
  }
  try {
    http.Response response = await http.patch(
      Uri.parse('$backendUrl/users/'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $userToken',
      },
      body: jsonEncode(<String, String>{
        'email': newEmail,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to update username');
    }
    return UpdateSettingStatus.updated;
  } catch (error) {
    return UpdateSettingStatus.error;
  }
}

Future<UpdateSettingStatus> tryUpdatePassword(String backendUrl,
  String actualPassword, String newPassword) async {
  if (newPassword == '' || newPassword == actualPassword) {
    return UpdateSettingStatus.notUpdated;
  }
  User? user = FirebaseAuth.instance.currentUser;
  if (user == null) {
    return UpdateSettingStatus.error;
  }
  try {
    await user.reauthenticateWithCredential(EmailAuthProvider.credential(
      email: user.email!,
      password: actualPassword,
    ));
    await user.updatePassword(newPassword);
    return UpdateSettingStatus.updated;
  }
  catch (error) {
    return UpdateSettingStatus.error;
  }
}

Future<void> deleteAccount(String backendUrl, User? user, BuildContext context) async {
  if (user == null) {
    return;
  }
  String userToken = await user.getIdToken() as String;

  await http.delete(
    Uri.parse('$backendUrl/users'),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $userToken',
    },
  );
  if (!context.mounted) {
    return;
  }
  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => const RegisterView(),
    ),
  );
}
