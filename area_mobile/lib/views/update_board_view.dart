import 'package:area_mobile/main.dart';
import 'package:area_mobile/services/board_service.dart';
import 'package:area_mobile/services/global_service.dart';
import 'package:area_mobile/widgets/generic_button.dart';
import 'package:area_mobile/widgets/generic_text_field.dart';
import 'package:area_mobile/widgets/modal.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hsvcolor_picker/flutter_hsvcolor_picker.dart';

class UpdateBoardView extends StatefulWidget {
  const UpdateBoardView({
    Key? key,
    required this.board,
  }) : super(key: key);

  final dynamic board;

  @override
  State<UpdateBoardView> createState() => _UpdateBoardViewState();
}

class _UpdateBoardViewState extends State<UpdateBoardView> {
  User? user;
  final TextEditingController boardNameController = TextEditingController();
  HSVColor color = HSVColor.fromColor(Colors.blue);

  @override
  void initState() {
    super.initState();
    color = HSVColor.fromColor(Color(
        int.parse(widget.board['color'].substring(1, 7), radix: 16) +
            0xFF000000));
  }

  void onChanged(HSVColor value) => color = value;

  Future<void> handleUpdateBoard() async {
    user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      return;
    }
    Color rgbColor = color.toColor();
    String hexColor = rgbColor.value.toRadixString(16);
    hexColor = '#${hexColor.substring(2, hexColor.length)}';
    BoardUpdateStatus boardUpdateStatus = await tryUpdateBoard(user, 'http://10.0.2.2:8080',
        widget.board['id'], boardNameController.text, hexColor);

    if (boardUpdateStatus == BoardUpdateStatus.error ||
        boardUpdateStatus == BoardUpdateStatus.notUpdated) {
      if (!context.mounted) {
        return;
      }
      displayModal(context, BoardUpdateStatus.notUpdated == boardUpdateStatus
          ? "Board name can't be empty"
          : "An error occured while updating the board. Please try again later.",
        () => {});
      return;
    }
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

  Future<void> handleDeleteBoard() async {

    displayModal(context, "Are you sure you want to delete this board?", () async {
      user = FirebaseAuth.instance.currentUser;
      if (user == null) {
        return;
      }
      await deleteBoard(user, 'http://10.0.2.2:8080', widget.board['id']);
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
    }, onCancel: () {
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.board['name']),
      ),
      body: Padding(
        padding: const EdgeInsets.all(30),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            CustomTextField(
              outlineColor: Colors.grey,
              hintText: "Board name",
              hintTextColor: Colors.grey,
              controller: boardNameController,
              keyboardType: TextInputType.text,
              obscureText: false,
              initialText: widget.board['name'],
            ),
            const SizedBox(height: 16),
            const Text(
              "Board color:",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            PaletteHuePicker(
              onChanged: (value) => super.setState(
                () => onChanged(value),
              ),
              color: color,
            ),
            const SizedBox(height: 16),
            CustomButton(
              color: Colors.green,
              text: "Update",
              textColor: Colors.white,
              onPressed: handleUpdateBoard,
            ),
            const SizedBox(height: 16),
            CustomButton(
              color: Colors.red,
              text: "Delete",
              textColor: Colors.white,
              onPressed: handleDeleteBoard,
            )
          ],
        ),
      ),
    );
  }
}
