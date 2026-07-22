package com.mentorplatform.util;

public final class Constants {
    private Constants() {}

    public static final String API_PREFIX = "/api";
    public static final String AUTH_PREFIX = API_PREFIX + "/auth";
    public static final String SESSION_PREFIX = API_PREFIX + "/sessions";
    public static final String MESSAGE_PREFIX = API_PREFIX + "/messages";

    public static final String WS_ENDPOINT = "/ws";
    public static final String TOPIC_PREFIX = "/topic";
    public static final String APP_PREFIX = "/app";

    public static final String TOPIC_SESSION = "/topic/session/";
    public static final String TOPIC_CODE_SUFFIX = "/code";
    public static final String TOPIC_CHAT_SUFFIX = "/chat";
    public static final String TOPIC_SIGNAL_SUFFIX = "/signal";

    public static final String AUTH_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";

    public static final String[] PUBLIC_URLS = {
            "/api/auth/**",
            "/ws/**"
    };
}
