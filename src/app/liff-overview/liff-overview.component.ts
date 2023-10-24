import {Component, OnInit} from '@angular/core';
import liff from '@line/liff';
import {Profile} from '@liff/get-profile/lib';

type JwtPayload = ReturnType<typeof liff.getDecodedIDToken>
type OS = ReturnType<typeof liff.getOS>

@Component({
    selector: 'app-liff-overview',
    templateUrl: './liff-overview.component.html',
    styleUrls: ['./liff-overview.component.scss']
})
export class LiffOverviewComponent implements OnInit {
    liffId = '2000461397-MVoQBAp4';
    protected decodedIdToken!: JwtPayload | null;
    protected picture = '../assets/images/users/profile.png';
    protected os: OS;
    protected profile?: Profile;
    protected friendship?: boolean;
    protected scanCodeResult?: string | null = '';
    private name?: string;

    constructor() {
    }


    ngOnInit(): void {
        liff.init({
            liffId: this.liffId,
            withLoginOnExternalBrowser: true,
        }).then(() => {
            this.decodedIdToken = liff.getDecodedIDToken();
            this.picture = this.decodedIdToken?.picture ?? '../assets/images/users/profile.png';
            this.os = liff.getOS();
            liff.getFriendship().then(friend => {
                this.friendship = friend.friendFlag;
            });
            liff.getProfile().then(profile => {
                this.profile = profile;
            });
        });
    }

    scanCode() {
        liff.scanCodeV2().then(code => {
            this.scanCodeResult = code.value || '';
        });

    }
}
