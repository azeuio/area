import 'package:area_mobile/widgets/generic_text_field.dart';
import 'package:flutter/material.dart';
import 'package:area_mobile/area_theme.dart';
import 'package:area_mobile/widgets/generic_button.dart';

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
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

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
              Text(
                '$_counter',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              CustomTextField(
                outlineColor: const Color(0xFFD9D9D9),
                hintText: "email",
                hintTextColor: const Color(0xFF8E8E93),
                controller: TextEditingController(),
                obscureText: false,
              ),
              CustomTextField(
                outlineColor: const Color(0xFFD9D9D9),
                hintText: "password",
                hintTextColor: const Color(0xFF8E8E93),
                controller: TextEditingController(),
                obscureText: true,
              ),
              CustomButton(
                color: const Color(0xFF2EBD59),
                text: 'Increment',
                textColor: Colors.black,
                icon: Icons.add,
                onPressed: _incrementCounter,
              ),
              CustomButton(
                color: const Color(0xFF2EBD59),
                text: "Increment",
                textColor: Colors.black,
                onPressed: _incrementCounter,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
