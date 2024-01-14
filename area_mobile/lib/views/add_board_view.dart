import 'package:area_mobile/constants.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hsvcolor_picker/flutter_hsvcolor_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'package:area_mobile/main.dart';
import 'package:area_mobile/widgets/modal.dart';
import 'package:area_mobile/services/board_service.dart';
import 'package:area_mobile/widgets/generic_button.dart';
import 'package:area_mobile/services/global_service.dart';
import 'package:area_mobile/widgets/generic_text_field.dart';

class AddBoardView extends StatefulWidget {
  const AddBoardView({Key? key}) : super(key: key);

  @override
  State<AddBoardView> createState() => _AddBoardViewState();
}

class _AddBoardViewState extends State<AddBoardView> {
  final TextEditingController boardNameController = TextEditingController();
  HSVColor color = HSVColor.fromColor(Colors.blue);
  void onChanged(HSVColor value) => {
        color = value,
      };

  Future<void> handleCreateBoard() async {
    User? user = await getCurrentUser();
    Color rgbColor = color.toColor();
    String hexColor = rgbColor.value.toRadixString(16);
    hexColor = '#${hexColor.substring(2, hexColor.length)}';
    BoardCreationStatus boardCreationStatus = await tryAddBoard(
        user, AppConstants.apiUrl, boardNameController.text, hexColor);

    if (boardCreationStatus == BoardCreationStatus.error ||
        boardCreationStatus == BoardCreationStatus.notCreated) {
      if (!context.mounted) {
        return;
      }
      displayModal(
          context,
          boardCreationStatus == BoardCreationStatus.notCreated
              ? "Board name can't be empty"
              : "An error occured while creating the board. Please try again later.",
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Add a board"),
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
              text: "Create",
              textColor: Colors.white,
              onPressed: handleCreateBoard,
            ),
          ],
        ),
      ),
    );
  }
}
