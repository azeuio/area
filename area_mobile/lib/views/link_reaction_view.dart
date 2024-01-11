import 'dart:convert';

import 'package:area_mobile/widgets/brick_button.dart';
import 'package:area_mobile/widgets/modal.dart';
import 'package:area_mobile/widgets/service_card.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class LinkReactionView extends StatefulWidget {
  final String actionId;
  const LinkReactionView({Key? key, required this.actionId}) : super(key: key);

  @override
  State<LinkReactionView> createState() => _LinkReactionViewState();
}

class _LinkReactionViewState extends State<LinkReactionView> {
  List<ServiceCard> serviceCards = [];
  BrickButton brickButton = BrickButton(
    color: const Color(0xFF000000),
    text: "Loading...",
    logo:
        "https://upload.wikimedia.org/wikipedia/commons/0/0b/Gear_icon_svg.svg",
    onPressed: () {},
  );

  @override
  void initState() {
    super.initState();
    displayAction(widget.actionId);
    displayServices();
  }

  Future<void> displayServices() async {
    String apiUrl = "http://192.168.122.1:8080/services/active";
    var userToken = await FirebaseAuth.instance.currentUser?.getIdToken();

    var result = await http.get(Uri.parse(apiUrl), headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $userToken',
    });

    if (result.statusCode == 200) {
      List<dynamic> servicesData = json.decode(result.body);
      List<ServiceCard> cards = servicesData.map((service) {
        return ServiceCard(
          color: Color(int.parse(service["color"])),
          name: service["name"],
          logoPath: service["logo"],
          colored: true,
          onPressed: () {},
        );
      }).toList();

      setState(() {
        serviceCards = cards;
      });
    } else {
      if (context.mounted) {
        displayModal(
          context,
          "Something went wrong when retrieving the services",
          () {},
        );
      }
    }
  }

  Future<void> displayAction(String actionId) async {
    String apiUrl = "http://192.168.122.1:8080/actions/$actionId";

    var result = await http.get(Uri.parse(apiUrl), headers: {
      'Content-Type': 'application/json',
    });

    if (result.statusCode == 200) {
      dynamic actionData = json.decode(result.body);
      String serviceId = actionData["service_id"];
      String serviceApiUrl = "http://192.168.122.1:8080/services/$serviceId";

      var response = await http.get(Uri.parse(serviceApiUrl), headers: {
        'Content-Type': 'application/json',
      });
      dynamic serviceData = json.decode(response.body);

      BrickButton tmpBrick = BrickButton(
        color: Color(int.parse(serviceData["color"])),
        text: actionData["name"],
        logo: serviceData["logo"],
        onPressed: () {},
      );

      setState(() {
        brickButton = tmpBrick;
      });
    } else {
      if (context.mounted) {
        displayModal(
          context,
          "Something went wrong when retrieving the selected action",
          () {},
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        resizeToAvoidBottomInset: false,
        body: SingleChildScrollView(
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          child: Padding(
            padding: const EdgeInsets.all(30),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(height: MediaQuery.of(context).size.height * 0.025),
                const Text(
                  "Selected action:",
                  style: TextStyle(
                    fontSize: 30,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: MediaQuery.of(context).size.height * 0.025),
                brickButton,
                SizedBox(height: MediaQuery.of(context).size.height * 0.025),
                const Text(
                  "Select a service to choose the reaction from:",
                  style: TextStyle(
                    fontSize: 30,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: MediaQuery.of(context).size.height * 0.025),
                GridView.builder(
                  shrinkWrap: true,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 15,
                    mainAxisSpacing: 15,
                  ),
                  itemCount: serviceCards.length,
                  itemBuilder: (BuildContext context, int index) {
                    return serviceCards[index];
                  },
                ),
              ],
            ),
          ),
        ));
  }
}
