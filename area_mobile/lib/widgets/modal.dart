import 'package:flutter/material.dart';


void displayModal(BuildContext context,
  String text, Function onConfirm, {Function? onCancel}) {
    showDialog(context: context,
    builder: (BuildContext context) {
    return
      AlertDialog(
        content: Text(text),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              onConfirm();
            },
            child: const Text('OK'),
          ),
          onCancel != null
            ? TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                onCancel();
              },
              child: const Text('Cancel'),
            )
            : Container(),
        ],
      );
    },
  );
}
