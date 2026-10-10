#import <Cocoa/Cocoa.h>
#import <objc/runtime.h>
#import <sys/socket.h>
#import <netinet/in.h>
#import <arpa/inet.h>
#import <unistd.h>

static const int WORDFORGE_DEFAULT_CONTROL_PORT = 58941;

static int get_control_port(void) {
    const char *env_port = getenv("WORDFORGE_CONTROL_PORT");
    if (env_port && *env_port) {
        int p = atoi(env_port);
        if (p > 0 && p < 65536) return p;
    }
    return WORDFORGE_DEFAULT_CONTROL_PORT;
}

static void send_file_open_to_wordforge(NSString *rawPath) {
    if (!rawPath || rawPath.length == 0) return;

    NSString *filePath = rawPath;
    if ([filePath hasPrefix:@"file://"]) {
        NSURL *url = [NSURL URLWithString:filePath];
        if (url && [url isFileURL]) {
            filePath = [url path];
        }
    }

    if (!filePath || filePath.length == 0) return;

    // Expand tilde if present
    filePath = [filePath stringByStandardizingPath];

    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0), ^{
        int port = get_control_port();
        
        // Retry for up to 8 seconds (80 * 100ms) to ensure WordForge engine has started
        for (int attempt = 0; attempt < 80; attempt++) {
            int sock = socket(AF_INET, SOCK_STREAM, 0);
            if (sock >= 0) {
                struct sockaddr_in sin;
                memset(&sin, 0, sizeof(sin));
                sin.sin_family = AF_INET;
                sin.sin_port = htons(port);
                sin.sin_addr.s_addr = inet_addr("127.0.0.1");

                if (connect(sock, (struct sockaddr *)&sin, sizeof(sin)) == 0) {
                    NSDictionary *cmd = @{
                        @"id": @(attempt + 1),
                        @"method": @"file.open",
                        @"params": @{ @"path": filePath }
                    };
                    NSError *err = nil;
                    NSData *json = [NSJSONSerialization dataWithJSONObject:cmd options:0 error:&err];
                    if (json) {
                        NSMutableData *payload = [NSMutableData dataWithData:json];
                        [payload appendBytes:"\n" length:1];
                        write(sock, payload.bytes, payload.length);

                        // Drain reply line
                        char buf[1024];
                        ssize_t n = read(sock, buf, sizeof(buf) - 1);
                        if (n > 0) {
                            buf[n] = 0;
                            NSLog(@"[WordForgeBridge] Opened document successfully: %@", filePath);
                        }
                    }
                    close(sock);

                    dispatch_async(dispatch_get_main_queue(), ^{
                        [NSApp activateIgnoringOtherApps:YES];
                    });
                    return;
                }
                close(sock);
            }
            usleep(100000); // 100ms
        }
        NSLog(@"[WordForgeBridge] Timeout connecting to WordForge control server for %@", filePath);
    });
}

@interface WordForgeAppleEventHandler : NSObject
- (void)handleOpenDocuments:(NSAppleEventDescriptor *)event withReplyEvent:(NSAppleEventDescriptor *)replyEvent;
@end

@implementation WordForgeAppleEventHandler
- (void)handleOpenDocuments:(NSAppleEventDescriptor *)event withReplyEvent:(NSAppleEventDescriptor *)replyEvent {
    NSAppleEventDescriptor *docList = [event descriptorForKeyword:keyDirectObject];
    NSInteger count = [docList numberOfItems];
    if (count > 0) {
        for (NSInteger i = 1; i <= count; i++) {
            NSAppleEventDescriptor *item = [docList descriptorAtIndex:i];
            NSString *str = [item stringValue];
            if (str) {
                send_file_open_to_wordforge(str);
            }
        }
    } else {
        NSString *str = [docList stringValue];
        if (str) {
            send_file_open_to_wordforge(str);
        }
    }
}
@end

static BOOL bridge_applicationOpenFile(id self, SEL _cmd, NSApplication *sender, NSString *filename) {
    send_file_open_to_wordforge(filename);
    return YES;
}

static void bridge_applicationOpenFiles(id self, SEL _cmd, NSApplication *sender, NSArray<NSString *> *filenames) {
    for (NSString *f in filenames) {
        send_file_open_to_wordforge(f);
    }
    if ([sender respondsToSelector:@selector(replyToOpenOrPrint:)]) {
        [sender replyToOpenOrPrint:NSApplicationDelegateReplySuccess];
    }
}

static void bridge_applicationOpenURLs(id self, SEL _cmd, NSApplication *sender, NSArray<NSURL *> *urls) {
    for (NSURL *u in urls) {
        if ([u isFileURL]) {
            send_file_open_to_wordforge([u path]);
        }
    }
}

static void patch_delegate_class(Class cls) {
    if (!cls) return;

    SEL selOpenFile = @selector(application:openFile:);
    if (!class_getInstanceMethod(cls, selOpenFile)) {
        class_addMethod(cls, selOpenFile, (IMP)bridge_applicationOpenFile, "c@:@@");
    }

    SEL selOpenFiles = @selector(application:openFiles:);
    if (!class_getInstanceMethod(cls, selOpenFiles)) {
        class_addMethod(cls, selOpenFiles, (IMP)bridge_applicationOpenFiles, "v@:@@");
    }

    SEL selOpenURLs = @selector(application:openURLs:);
    if (!class_getInstanceMethod(cls, selOpenURLs)) {
        class_addMethod(cls, selOpenURLs, (IMP)bridge_applicationOpenURLs, "v@:@@");
    }
}

static void (*orig_setDelegate)(id, SEL, id) = NULL;
static void bridge_setDelegate(id self, SEL _cmd, id delegate) {
    if (delegate) {
        patch_delegate_class([delegate class]);
    }
    if (orig_setDelegate) {
        orig_setDelegate(self, _cmd, delegate);
    }
}

__attribute__((constructor))
static void init_wordforge_bridge(void) {
    // Ensure control port is configured in environment for WordForge
    char port_str[16];
    snprintf(port_str, sizeof(port_str), "%d", WORDFORGE_DEFAULT_CONTROL_PORT);
    setenv("WORDFORGE_CONTROL_PORT", port_str, 0);

    // Register Apple Event handler for kAEOpenDocuments
    static WordForgeAppleEventHandler *s_handler = nil;
    if (!s_handler) {
        s_handler = [[WordForgeAppleEventHandler alloc] init];
        [[NSAppleEventManager sharedAppleEventManager]
            setEventHandler:s_handler
            andSelector:@selector(handleOpenDocuments:withReplyEvent:)
            forEventClass:kCoreEventClass
            andEventID:kAEOpenDocuments];
    }

    // Swizzle [NSApplication setDelegate:] so any delegate registered by winit is hooked
    Class appCls = [NSApplication class];
    Method m = class_getInstanceMethod(appCls, @selector(setDelegate:));
    if (m) {
        orig_setDelegate = (void (*)(id, SEL, id))method_getImplementation(m);
        method_setImplementation(m, (IMP)bridge_setDelegate);
    }
}
