import 'dart:io';
import 'package:record/record.dart';
import 'package:permission_handler/permission_handler.dart';

class AudioRecorderService {
  final AudioRecorder _recorder = AudioRecorder();

  Future<bool> hasPermission() async {
    final status = await Permission.microphone.status;
    if (status.isGranted) return true;
    final result = await Permission.microphone.request();
    return result.isGranted;
  }

  Future<void> startRecording(String filePath) async {
    final permitted = await hasPermission();
    if (!permitted) {
      throw Exception('Microphone permission denied');
    }

    // Configure canonical 16kHz Mono 16-bit PCM WAV
    const config = RecordConfig(
      encoder: AudioEncoder.wav,
      sampleRate: 16000,
      numChannels: 1,
      bitRate: 128000,
    );

    await _recorder.start(config, path: filePath);
  }

  Future<String?> stopRecording() async {
    return await _recorder.stop();
  }

  Future<bool> isRecording() async {
    return await _recorder.isRecording();
  }

  void dispose() {
    _recorder.dispose();
  }
}

