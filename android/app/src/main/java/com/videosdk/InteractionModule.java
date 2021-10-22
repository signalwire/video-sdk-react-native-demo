package com.videosdk;

import android.content.Context;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class InteractionModule extends ReactContextBaseJavaModule {
    Context context;

    InteractionModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "InteractionModule";
    }

    @ReactMethod
    public void launch() {
        MediaProjectionService.launch(context);
    }

    @ReactMethod
    public void abort() {
        MediaProjectionService.abort(context);
    }
}