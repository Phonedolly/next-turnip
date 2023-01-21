import { format } from "date-fns-tz"

export default function now() {
    return format(Date.now(), "yyyy-MM-dd hh:mm.ss") + ": "
}