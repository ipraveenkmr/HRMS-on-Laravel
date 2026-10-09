import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controller/authentication.dart';
import '../door/widgets/cdotcomponents.dart';
import 'task_page.dart';

class AddTaskPage extends StatefulWidget {
  const AddTaskPage({super.key});

  @override
  State<AddTaskPage> createState() => _AddTaskPageState();
}

class _AddTaskPageState extends State<AddTaskPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController taskCtrl = TextEditingController();
  final TextEditingController managerCtrl = TextEditingController();
  final TextEditingController descCtrl = TextEditingController();
  bool isSaving = false;

  @override
  void dispose() {
    taskCtrl.dispose();
    managerCtrl.dispose();
    descCtrl.dispose();
    super.dispose();
  }

  Future<void> _submitTask() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => isSaving = true);
    await dailyTask(taskCtrl.text.trim(), managerCtrl.text.trim(), descCtrl.text.trim());
    if (mounted) {
      setState(() => isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Add Daily Task",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.normal),
        ),
        elevation: 0.5,
        iconTheme: const IconThemeData(color: Colors.white),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: <Color>[
                Theme.of(context).primaryColor,
                Theme.of(context).colorScheme.secondary,
              ],
            ),
          ),
        ),
      ),
      drawer: CdotComponents.sidenav(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: taskCtrl,
                decoration: const InputDecoration(
                  labelText: 'Task Title *',
                  hintText: 'What did you work on today?',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.task_alt),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Task title is required.' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: descCtrl,
                decoration: const InputDecoration(
                  labelText: 'Task Details',
                  hintText: 'Enter accomplishments, progress, or notes...',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.notes),
                ),
                maxLines: 4,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: managerCtrl,
                decoration: const InputDecoration(
                  labelText: 'Supervisor / Manager (Optional)',
                  hintText: 'Supervisor name',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person_outline),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                icon: isSaving
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Icon(Icons.save),
                label: Text(isSaving ? 'Submitting...' : 'Save Task'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: isSaving ? null : _submitTask,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
