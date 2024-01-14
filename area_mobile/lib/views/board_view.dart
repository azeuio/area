import 'package:area_mobile/constants.dart';
import 'package:area_mobile/services/board_service.dart';
import 'package:area_mobile/services/global_service.dart';
import 'package:area_mobile/views/update_board_view.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class BoardView extends StatefulWidget {
  const BoardView({
    Key? key,
    required this.boardId,
  }) : super(key: key);

  final String boardId;
  @override
  State<BoardView> createState() => _BoardViewState();
}

class _BoardViewState extends State<BoardView> {
  User? user;
  dynamic board;
  late Future<dynamic> boardFuture = getCurrentUser().then((User? user) {
    setState(() {
      this.user = user;
    });
    return getBoard(user, AppConstants.apiUrl, widget.boardId);
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<dynamic>(
          future: boardFuture,
          builder: (BuildContext context, AsyncSnapshot<dynamic> snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Text('Error: ${snapshot.error}');
            } else {
              board = snapshot.data;
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
                          builder: (context) => UpdateBoardView(
                            board: board,
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            );
          }),
    );
  }
}
