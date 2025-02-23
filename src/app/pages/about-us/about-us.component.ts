import { Component, OnInit } from '@angular/core';
import { getAnalytics, logEvent } from "firebase/analytics";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.less']
})
export class AboutUsComponent implements OnInit {


  public analytics;

  constructor() { this.analytics = getAnalytics(); }

  ngOnInit(): void {
    logEvent(this.analytics, 'about_web', {});
  }

}
