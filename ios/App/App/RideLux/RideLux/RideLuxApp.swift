//
//  RideLuxApp.swift
//  RideLux
//
//  Created by Lavdim on 4/8/25.
//

import SwiftUI

@main
struct RideLuxApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
