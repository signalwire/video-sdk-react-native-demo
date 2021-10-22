package com.videosdk;

import android.app.Notification;
import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

/**
 * This class implements an Android {@link Service}, a foreground one specifically, and it's
 * responsible for presenting an ongoing notification when a conference is in progress.
 * The service will help keep the app running while in the background.
 * <p>
 * See: https://developer.android.com/guide/components/services
 */
public class MediaProjectionService extends Service {
    private static final String TAG = MediaProjectionService.class.getSimpleName();

    static final class Actions {
        static final String START = TAG + ":START";
        static final String HANGUP = TAG + ":HANGUP";
    }

    static void launch(Context context) {
        OngoingNotification.createOngoingConferenceNotificationChannel(context);

        Intent intent = new Intent(context, MediaProjectionService.class);
        intent.setAction(Actions.START);

        ComponentName componentName;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            componentName = context.startForegroundService(intent);
        } else {
            componentName = context.startService(intent);
        }
        if (componentName == null) {
        }
    }

    static void abort(Context context) {
        Intent intent = new Intent(context, MediaProjectionService.class);
        context.stopService(intent);
    }

    @Override
    public void onCreate() {
        super.onCreate();

    }

    @Override
    public void onDestroy() {

        super.onDestroy();
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        stopSelf();
        super.onTaskRemoved(rootIntent);

    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        final String action = intent.getAction();
        if (Actions.START.equals(action)) {
            Notification notification = OngoingNotification.buildOngoingConferenceNotification(MediaProjectionService.this);
            if (notification == null) {
                stopSelf();
            } else {
                startForeground(OngoingNotification.NOTIFICATION_ID, notification);
            }
        } else if (Actions.HANGUP.equals(action)) {
            stopSelf();
        } else {
            stopSelf();
        }

        return START_NOT_STICKY;
    }

}