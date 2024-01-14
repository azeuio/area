import 'dart:convert';

import 'package:area_mobile/dto/action_dto.dart';
import 'package:http/http.dart' as http;

Future<List<ActionDto>?> getActions(String backendUrl) async {
  try {
    List<ActionDto> actions = [];

    http.Response response = await http.get(
      Uri.parse('$backendUrl/actions'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to get actions');
    }
    for (var action in jsonDecode(response.body)) {
      actions.add(ActionDto.fromJson(action));
    }
    return actions;
  } catch (error) {
    return null;
  }
}

Future<List<ActionDto>?> getActionsFromService(String backendUrl, String serviceId, bool isATrigger) async {
  try {
    List<ActionDto> actions = [];
    http.Response response = await http.get(
      Uri.parse('$backendUrl/actions/from-service/$serviceId'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to get actions');
    }
    for (var action in jsonDecode(response.body)) {
      if (action['is_a_trigger'] == isATrigger) {
        actions.add(ActionDto.fromJson(action));
      }
    }
    return actions;
  } catch (error) {
    return null;
  }
}
