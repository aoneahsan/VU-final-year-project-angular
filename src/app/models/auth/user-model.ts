export class User {
    constructor(
        public id,
        public name,
        public email,
        public phone_number,
        public profile_img,
        public role,
        public _tokken,
        public tokken_expire_time
    ) {}

        // get user tokken
        get tokken() {
            // if (!this.tokken_expire_time || new Date() > this.tokken_expire_time) {
            //     return null;
            // }
            return this._tokken;
        }
}