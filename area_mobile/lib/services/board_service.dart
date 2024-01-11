import 'dart:convert';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;

enum BoardCreationStatus {
  created,
  notCreated,
  error
}

enum BoardUpdateStatus {
  updated,
  notUpdated,
  error
}

Future<List<dynamic>?> getUserBoards(User? user, String backendUrl) async {
  if (user == null) {
    return null;
  }
  String userToken = await user.getIdToken() as String;
  try {
    http.Response response = await http.get(
      Uri.parse('$backendUrl/boards/'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $userToken',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to get user boards');
    }
    return jsonDecode(response.body);
  } catch (error) {
    return null;
  }
}

Future<BoardCreationStatus> tryAddBoard(User? user, String backendUrl, String name, String color) async {
  if (user == null || name.isEmpty) {
    return BoardCreationStatus.notCreated;
  }
  String userToken = await user.getIdToken() as String;

  try {
    http.Response response = await http.post(
      Uri.parse('$backendUrl/boards/'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $userToken',
      },
      body: jsonEncode(<String, String>{
        'name': name,
        'description': '',
        'color': color,
      }),
    );
    if (response.statusCode != 201) {
      throw Exception('Failed to add board');
    }
    return BoardCreationStatus.created;
  } catch (error) {
    return BoardCreationStatus.error;
  }
}

Future<dynamic> getBoard(User? user, String backendUrl, String boardId) async {
  if (user == null) {
    return null;
  }
  String userToken = await user.getIdToken() as String;

  try {
    http.Response response = await http.get(
      Uri.parse('$backendUrl/boards/$boardId'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $userToken',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to get board');
    }
    return jsonDecode(response.body);
  } catch (error) {
    return null;
  }
}

Future<BoardUpdateStatus> tryUpdateBoard(User? user, String backendUrl, String boardId, String name, String color) async {
  if (user == null || name.isEmpty) {
    return BoardUpdateStatus.notUpdated;
  }
  String userToken = await user.getIdToken() as String;

  try {
    http.Response response = await http.patch(
      Uri.parse('$backendUrl/boards/${boardId}'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $userToken',
      },
      body: jsonEncode(<String, String>{
        'name': name,
        'color': color,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to update board');
    }
    return BoardUpdateStatus.updated;
  } catch (error) {
    return BoardUpdateStatus.error;
  }
}

Future<void> deleteBoard(User? user, String backendUrl, String boardId) async {
  if (user == null) {
    return;
  }
  String userToken = await user.getIdToken() as String;

  try {
    http.Response response = await http.delete(
      Uri.parse('$backendUrl/boards/$boardId'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $userToken',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete board');
    }
  } catch (error) {
    return;
  }
}
