package com.videosdk;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;


import java.util.Random;


/**
 * Helper class for creating the ongoing notification which is used with
 * {@link MediaProjectionService}. It allows the user to easily get back to the app
 * and to hangup from within the notification itself.
 */
class OngoingNotification {
    private static final String TAG = OngoingNotification.class.getSimpleName();

    private static final String CHANNEL_ID = "NotificationChannel";
    private static final String CHANNEL_NAME = "Ongoing Conference Notifications";

    static final int NOTIFICATION_ID = new Random().nextInt(99999) + 10000;


    static void createOngoingConferenceNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return;
        }

        NotificationManager notificationManager
            = (NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);

        NotificationChannel channel
            = notificationManager.getNotificationChannel(CHANNEL_ID);
        if (channel != null) {
            // The channel was already created, no need to do it again.
            return;
        }

        channel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_DEFAULT);
        channel.enableLights(false);
        channel.enableVibration(false);
        channel.setShowBadge(false);

        notificationManager.createNotificationChannel(channel);
    }

    static Notification buildOngoingConferenceNotification(Context context) {

        Intent notificationIntent = new Intent(context, context.getClass());
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, notificationIntent, 0);

        NotificationCompat.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder = new NotificationCompat.Builder(context, CHANNEL_ID);
        } else {
            builder = new NotificationCompat.Builder(context);
        }

        builder
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setContentTitle(context.getString(R.string.ongoing_notification_title))
            .setContentText(context.getString(R.string.ongoing_notification_text))
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setAutoCancel(false)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setUsesChronometer(true)
            .setOnlyAlertOnce(true)
            .setSmallIcon(context.getResources().getIdentifier("ic_notification", "drawable", context.getPackageName()));


        return builder.build();
    }
}