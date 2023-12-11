import 'package:area_mobile/widgets/service_card.dart';
import 'package:flutter/material.dart';
import 'package:area_mobile/area_theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: areaTheme,
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(38),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: <Widget>[
              Text(
                'You have pushed the button this many times:',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const Text("0"),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const ServiceCard(
                    color: Color(0xFF2EBD59),
                    name: 'Spotify',
                    logoPath: "assets/spotify_logo.png",
                    colored: false,
                  ),
                  ServiceCard(
                    color: const Color(0xFF2EBD59),
                    name: 'Spotify',
                    logoPath: "assets/spotify_logo.png",
                    colored: true,
                    onPressed: () {
                      print('Colored card pressed!');
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
