package com.ansioff.app;

import android.app.Activity;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.play.core.review.ReviewInfo;
import com.google.android.play.core.review.ReviewManager;
import com.google.android.play.core.review.ReviewManagerFactory;
import com.google.android.gms.tasks.Task;

@CapacitorPlugin(name = "AppReview")
public class AppReviewPlugin extends Plugin {

    @PluginMethod
    public void requestReview(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            JSObject result = new JSObject();
            result.put("requested", false);
            result.put("reason", "activity_unavailable");
            call.resolve(result);
            return;
        }

        ReviewManager manager = ReviewManagerFactory.create(activity);
        Task<ReviewInfo> request = manager.requestReviewFlow();
        request.addOnCompleteListener((task) -> {
            if (!task.isSuccessful()) {
                JSObject result = new JSObject();
                result.put("requested", false);
                Exception exception = task.getException();
                if (exception != null) {
                    result.put("reason", exception.getMessage());
                } else {
                    result.put("reason", "review_info_unavailable");
                }
                call.resolve(result);
                return;
            }

            Task<Void> flow = manager.launchReviewFlow(activity, task.getResult());
            flow.addOnCompleteListener((ignored) -> {
                JSObject result = new JSObject();
                result.put("requested", true);
                call.resolve(result);
            });
        });
    }
}
