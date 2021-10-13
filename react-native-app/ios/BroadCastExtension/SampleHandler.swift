//
//  SampleHandler.swift
//  BroadCastExtension
//
//  Created by Zeeshan Saiyed on 16/08/21.
//

import ReplayKit
import BroadcastPod

private enum Constants {
    // the App Group ID value that the app and the broadcast extension targets are setup with. It differs for each app.
    static let appGroupIdentifier = "group.com.signalwire.screensharing.appgroup"
}

class SampleHandler: BPBroadcastHandler {
    override init() {
        super.init(identifier:Constants.appGroupIdentifier)
    }
}
