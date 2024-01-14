import 'package:area_mobile/constants.dart';
import 'package:area_mobile/dto/service_dto.dart';
import 'package:area_mobile/services/global_service.dart';
import 'package:area_mobile/services/services_service.dart';
import 'package:area_mobile/widgets/service_card.dart';
import 'package:area_mobile/views/select_action_from_service_view.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class SelectActionService extends StatefulWidget {
  const SelectActionService({
    Key? key,
    required this.boardId,
  }) : super(key: key);

  final String boardId;

  @override
  State<SelectActionService> createState() => _SelectActionServiceState();
}

class _SelectActionServiceState extends State<SelectActionService> {
  User? user;
  List<ServiceDto>? activeServices;
  late Future<List<ServiceDto>?> activeServicesFuture = getCurrentUser().then((User? user) {
    setState(() {
      this.user = user;
    });
    return getActiveServices(user, AppConstants.apiUrl);
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Select a service"),
      ),
      body: FutureBuilder<List<ServiceDto>?>(
        future: activeServicesFuture,
        builder: (BuildContext context, AsyncSnapshot<List<ServiceDto>?> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          } else {
            activeServices = snapshot.data;
          }
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Wrap(
                  spacing: 16.0,
                  runSpacing: 16.0,
                  children: [
                    if (activeServices != null)
                      for (var service in activeServices!)
                        ServiceCard(
                          name: service.name,
                          color: Color(int.parse(service.color)),
                          colored: true,
                          logoPath: service.logo,
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => SelectActionFromService(boardId: widget.boardId, serviceId: service.id , isATrigger: true),
                              ),
                            );
                          },
                        ),
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
