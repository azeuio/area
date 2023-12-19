import 'package:flutter/material.dart';
import 'package:area_mobile/widgets/brick_button.dart';

class BoardsPage extends StatelessWidget {
  const BoardsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            BrickButton(
              color: Colors.blue,
              text: "Andreas est trop beau",
              logo: "https://www.freepnglogos.com/uploads/spotify-logo-png/spotify-download-logo-30.png",
              onPressed: () {
                print("Blue");
              },
            ),
            BrickButton(
              color: Colors.red,
              text: "Hello World",
              logo: "https://www.freepnglogos.com/uploads/spotify-logo-png/spotify-download-logo-30.png",
              onPressed: () {
                print("Red");
              },
            ),
          ],
        ),
      ),
    );
  }
}
