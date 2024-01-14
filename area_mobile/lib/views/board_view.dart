import 'package:area_mobile/constants.dart';
import 'package:area_mobile/dto/action_dto.dart';
import 'package:area_mobile/dto/area_dto.dart';
import 'package:area_mobile/dto/service_dto.dart';
import 'package:area_mobile/services/actions_service.dart';
import 'package:area_mobile/services/area_service.dart';
import 'package:area_mobile/services/board_service.dart';
import 'package:area_mobile/services/global_service.dart';
import 'package:area_mobile/services/services_service.dart';
import 'package:area_mobile/views/link_reaction_view.dart';
import 'package:area_mobile/views/select_action_service_view.dart';
import 'package:area_mobile/views/update_board_view.dart';
import 'package:area_mobile/widgets/brick_button.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class BoardView extends StatefulWidget {
  final String boardId;

  const BoardView({
    Key? key,
    required this.boardId,
  }) : super(key: key);

  @override
  State<BoardView> createState() => _BoardViewState();
}

class _BoardViewState extends State<BoardView> {
  User? user;
  dynamic board;
  List<List<AreaWithIdDto>>? areas = [];
  List<ServiceDto>? services = [];
  List<ActionDto>? actions = [];
  late Future<List<dynamic>> combinedFutures = Future.wait([
    getCurrentUser().then((User? user) =>
      getBoard(user, AppConstants.apiUrl, widget.boardId)
    ),
    getCurrentUser().then((User? user) =>
      getAreas(user, AppConstants.apiUrl, widget.boardId)
    ),
    getServices(AppConstants.apiUrl),
    getActions(AppConstants.apiUrl)
  ]);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<List<dynamic>>(
        future: combinedFutures,
        builder: (BuildContext context, AsyncSnapshot<List<dynamic>> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          } else {
            board = snapshot.data![0];
            areas = snapshot.data![1];
            services = snapshot.data![2];
            actions = snapshot.data![3];
          }
          List<Widget> areaWidgets = [];

          if (areas != null) {
          for (List<AreaWithIdDto> areaList in areas!) {
            for (AreaWithIdDto area in areaList) {
              ActionDto? action = actions?.firstWhere(
                (action) => action.id == area.action.id,
                orElse: () => ActionDto(id: '', name:'', description: '', serviceId: '', isATrigger: false),
              );
              ServiceDto? service = services?.firstWhere(
                (service) => service.id == action?.serviceId,
                orElse: () => ServiceDto(id: '', name:'', logo: '', color: ''),
              );
              if (service == null) continue;
              areaWidgets.add(BrickButton(
                key: Key(area.id.toString()),
                text: action?.name ?? '',
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => LinkReactionView(actionId: action!.id, boardId: widget.boardId)
                    ),
                  );
                },
                logo: service.logo,
                color: Color(int.parse(service.color)),
              ));
            }
            areaWidgets.add(const SizedBox(height: 40));
          }
          }

          return Scaffold(
            appBar: AppBar(
              title: Text(board['name']),
              actions: <Widget>[
                IconButton(
                  icon: const Icon(Icons.settings),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => UpdateBoardView(board: board),
                      ),
                    );
                  },
                ),
              ],
            ),
            floatingActionButton: FloatingActionButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => SelectActionService(boardId: board['id']),
                  ),
                );
              },
              child: const Icon(Icons.add),
            ),
            floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
            body: ListView(
              children: areaWidgets,
            ),
          );
        }
      ),
    );
  }
}
