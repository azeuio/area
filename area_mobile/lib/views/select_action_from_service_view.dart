import 'package:area_mobile/constants.dart';
import 'package:area_mobile/dto/action_dto.dart';
import 'package:area_mobile/dto/service_dto.dart';
import 'package:area_mobile/main.dart';
import 'package:area_mobile/services/actions_service.dart';
import 'package:area_mobile/services/area_service.dart';
import 'package:area_mobile/services/global_service.dart';
import 'package:area_mobile/services/services_service.dart';
import 'package:area_mobile/views/link_reaction_view.dart';
import 'package:area_mobile/widgets/board_card.dart';
import 'package:area_mobile/widgets/modal.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class SelectActionFromService extends StatefulWidget {
  final String boardId;
  final String serviceId;
  final bool isATrigger;
  final String? triggerId;

  const SelectActionFromService({
    Key? key,
    required this.boardId,
    required this.serviceId,
    required this.isATrigger,
    this.triggerId,
  }) : super(key: key);

  @override
  State<SelectActionFromService> createState() => _SelectActionFromServiceState();
}

class _SelectActionFromServiceState extends State<SelectActionFromService> {
  List<ActionDto>? actions;
  ServiceDto? service;
  List<dynamic>? combinedResults;
  late Future<List<dynamic>> combinedFutures = Future.wait([
    getService(AppConstants.apiUrl, widget.serviceId),
    getActionsFromService(AppConstants.apiUrl, widget.serviceId, widget.isATrigger),
  ]);

  void handleAreaCreation(ActionDto action) async {
    User? user = await getCurrentUser();

    if (widget.triggerId == null) {
      return;
    }
    createArea(AppConstants.apiUrl, user, widget.boardId, widget.triggerId!, action.id);
    if (!context.mounted) {
      return;
    }
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const HomePage(
          title: 'Boards',
        ),
      ),
    );
  }

  void handleAction(ActionDto action) {
      displayModal(context, action.description, widget.isATrigger
        ? () => {
          Navigator.push(
              context,
              MaterialPageRoute(
              builder: (context) => LinkReactionView(boardId: widget.boardId, actionId: action.id),
            ),
          )
        }
        : () => {
          handleAreaCreation(action),
        },
        onCancel: () => {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: widget.isATrigger ? const Text('Select an action') : const Text('Select a reaction'),
      ),
      body: FutureBuilder<List<dynamic>>(
        future: combinedFutures,
        builder: (BuildContext context, AsyncSnapshot<List<dynamic>> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          } else {
            service = snapshot.data![0];
            actions = snapshot.data![1];
          }

          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Wrap(
                  spacing: 16.0,
                  runSpacing: 16.0,
                  children: [
                    if (actions != null)
                      for (var action in actions!)
                        BoardCard(
                          backgroundColor: service != null ? Color(int.parse(service!.color)) : Colors.transparent,
                          title: action.name,
                          onTap: () => handleAction(action),
                        )
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
