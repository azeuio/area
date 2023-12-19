import 'dart:developer';

import 'package:area_mobile/views/boards_view.dart';
import 'package:flutter/material.dart';
import 'package:area_mobile/widgets/bottom_nav_bar.dart';
import 'package:area_mobile/area_theme.dart';
import 'package:area_mobile/views/areas_view.dart';
import 'package:area_mobile/views/profile_view.dart';
import 'package:area_mobile/views/register_view.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeFirebase();
  runApp(const Area());
}

Future<void> initializeFirebase() async {
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
  } catch (e) {
    log('Error when initializing Firebase: $e', level: 0);
  }
}

class Area extends StatelessWidget {
  const Area({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: areaTheme,
      home: const RegisterView(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key, required this.title});

  final String title;

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: CustomBottomNavigationBar(
        onItemTapped: _onItemTapped,
        selectedItem: _selectedIndex,
      ),
      body: _getBody(),
    );
  }

  Widget _getBody() {
    switch (_selectedIndex) {
      case 0:
        return const BoardsView();
      case 1:
        return const AreasView();
      case 2:
        return const ProfileView();
      default:
        return const Text('Invalid index');
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }
}
