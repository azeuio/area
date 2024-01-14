import 'package:area_mobile/constants.dart';
import 'package:area_mobile/services/board_service.dart';
import 'package:area_mobile/services/global_service.dart';
import 'package:area_mobile/views/add_board_view.dart';
import 'package:area_mobile/views/board_view.dart';
import 'package:area_mobile/widgets/board_card.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class BoardsView extends StatefulWidget {
  const BoardsView({Key? key}) : super(key: key);

  @override
  State<BoardsView> createState() => _BoardsViewState();
}

class _BoardsViewState extends State<BoardsView> {
  User? user;
  List<dynamic>? userBoards;
  late Future<List<dynamic>?> userBoardsFuture =
      getCurrentUser().then((User? user) {
    setState(() {
      this.user = user;
    });
    return getUserBoards(user, '${AppConstants.apiUrl}');
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: FutureBuilder<List<dynamic>?>(
      future: userBoardsFuture,
      builder: (BuildContext context, AsyncSnapshot<List<dynamic>?> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        } else {
          userBoards = snapshot.data;
        }
        return SingleChildScrollView(
          child: Center(
            child: Column(
              children: [
                const SizedBox(height: 64),
                const Text(
                  "My Boards",
                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 32),
                if (userBoards != null)
                  for (var board in userBoards!)
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      child: BoardCard(
                        backgroundColor: Color(int.parse(
                                board['color'].substring(1, 7),
                                radix: 16) +
                            0xFF000000),
                        title: board['name'],
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  BoardView(boardId: board['id']),
                            ),
                          );
                        },
                      ),
                    ),
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const AddBoardView(),
                      ),
                    );
                  },
                  child: const Icon(
                    Icons.add_circle_outline,
                    size: 64,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    ));
  }
}
