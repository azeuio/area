import 'dart:convert';

import 'package:area_mobile/dto/area_dto.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;

Future<void> createArea(String backendUrl, User? user, String boardId, String triggerId, String actionId) async {
  if (user == null) {
    return;
  }
  try {
    String userToken = await user.getIdToken() as String;
    CreateAreaDto action = CreateAreaDto(
      action: AreaAction(
        id: triggerId,
        outputs: {},
      ),
      boardId: boardId,
    );

    http.Response response = await http.post(
      Uri.parse('$backendUrl/areas'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $userToken'
      },
      body: jsonEncode(action.toJson()),
    );

    if (response.statusCode != 201) {
      throw Exception('Failed to create area');
    }
    CreateAreaDto reaction = CreateAreaDto(
      action: AreaAction(
        id: actionId,
        outputs: {},
      ),
      boardId: boardId,
      parentId: response.body,
    );
    await http.post(
      Uri.parse('$backendUrl/areas'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $userToken'
      },
      body: jsonEncode(reaction.toJson()),
    );
  } catch (error) {
    return;
  }
}


Future<List<List<AreaWithIdDto>>?> getAreas(User? user, String backendUrl, String boardId) async {
  if (user == null) {
    return null;
  }
  try {
    String userToken = await user.getIdToken() as String;
    http.Response response = await http.get(
      Uri.parse('$backendUrl/areas/$boardId'),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $userToken'
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to get areas');
    }
    Map<String, dynamic> areas = jsonDecode(response.body);
    List<AreaWithIdDto> areasWithId = [];
    List<List<AreaWithIdDto>> chains = [];
    areas.forEach((key, value) {
      areasWithId.add(AreaWithIdDto(
        action: AreaAction(
          id: value['action']['id'],
          outputs: value['action']['outputs'],
        ),
        boardId: value['board_id'],
        id: key,
        childId: value['child_id'],
      ));
    });
    List<AreaWithIdDto> areasWithoutChild = areasWithId.where((area) => area.childId == null).toList();

    for (var area in areasWithoutChild) {
      chains.add([area]);
    }
    List<AreaWithIdDto> toSort = areasWithId.where((area) => area.childId != null).toList();

    for (int i = 0; toSort.isNotEmpty && i < 100; i++) {
      for (List<AreaWithIdDto> chainArea in chains) {
        int index = toSort.indexWhere(
          (toSortArea) => toSortArea.childId == chainArea[0].id,
        );

        if (index != -1) {
          chainArea.insert(0, toSort[index]);
          toSort.removeAt(index);
        }
      }
    }
    return chains;
  } catch (error) {
    return null;
  }
}
