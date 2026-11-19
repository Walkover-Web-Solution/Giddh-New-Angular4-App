#!/usr/bin/env python3
"""Predict success/failure JSON for frontend-used catalog APIs from backend handlers.

Does not call live APIs. Does not overwrite live successExample.
Predicted errors are appended after existing examples and tagged source=backend-predicted.
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from datetime import date
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[4]
CAPTURE_DIR = Path(__file__).resolve().parent
CATALOGS = [
    ROOT / "docs/api/coverage/catalog.json",
    ROOT / "tools/giddh-api-explorer/public/data/catalog.json",
]
REPORT_PATH = CAPTURE_DIR / "PREDICTED-RESPONSES.md"
RESP_DIR = CAPTURE_DIR / "responses"
REQ_DIR = CAPTURE_DIR / "requests"
PREDICTED_AT = date.today().isoformat()
MAX_ERRORS = 12
SKIP_CODES = {"INVALID_AUTH_KEY", "INVALID_SESSION", "INVALID_SESSION_ID"}

SERVICE_ROOTS = {
    "giddh-api-v2": Path("/Users/divyanshu/Downloads/giddha-giddh-api-v2-57797b57402f"),
    "accounting-microservice": Path(
        "/Users/divyanshu/Downloads/giddha-giddh-accounting-microservice-21ec5e126986"
    ),
    "import-microservice": Path(
        "/Users/divyanshu/Downloads/giddha-giddh-import-microservice-eb3f6ae25db5"
    ),
    "search-api": Path("/Users/divyanshu/Downloads/giddha-giddh-search-api-a9ab0faf66ed"),
}

HTTP_STATUS = {
    "OK": (200, "OK"),
    "CREATED": (201, "CREATED"),
    "NO_CONTENT": (204, "NO_CONTENT"),
    "BAD_REQUEST": (400, "BAD_REQUEST"),
    "UNAUTHORIZED": (401, "UNAUTHORIZED"),
    "FORBIDDEN": (403, "FORBIDDEN"),
    "NOT_FOUND": (404, "NOT_FOUND"),
    "METHOD_NOT_ALLOWED": (405, "METHOD_NOT_ALLOWED"),
    "NOT_ACCEPTABLE": (406, "NOT_ACCEPTABLE"),
    "CONFLICT": (409, "CONFLICT"),
    "GONE": (410, "GONE"),
    "PRECONDITION_FAILED": (412, "PRECONDITION_FAILED"),
    "I_AM_A_TEAPOT": (418, "I_AM_A_TEAPOT"),
    "UNPROCESSABLE_ENTITY": (422, "UNPROCESSABLE_ENTITY"),
    "INTERNAL_SERVER_ERROR": (500, "INTERNAL_SERVER_ERROR"),
    "BAD_GATEWAY": (502, "BAD_GATEWAY"),
    "SERVICE_UNAVAILABLE": (503, "SERVICE_UNAVAILABLE"),
    "UNSUPPORTED_MEDIA_TYPE": (415, "UNSUPPORTED_MEDIA_TYPE"),
}

SKIP_CALLS = {
    "getMessage",
    "equals",
    "toString",
    "hashCode",
    "info",
    "debug",
    "warn",
    "error",
    "trace",
    "format",
    "of",
    "stream",
    "map",
    "filter",
    "collect",
    "orElse",
    "isEmpty",
    "isBlank",
    "isPresent",
    "size",
    "add",
    "put",
    "get",
    "set",
    "contains",
    "valueOf",
    "name",
    "ordinal",
}

FILE_CACHE: dict[Path, str] = {}
METHOD_CACHE: dict[tuple[str, str], list[dict[str, Any]]] = {}
CLASS_INDEX: dict[str, dict[str, list[Path]]] = defaultdict(lambda: defaultdict(list))
MESSAGES: dict[str, dict[str, str]] = {}
STATUS_MAP: dict[str, dict[str, tuple[int, str]]] = {}


def load_text(path: Path) -> str:
    cached = FILE_CACHE.get(path)
    if cached is None:
        cached = path.read_text(encoding="utf-8", errors="replace")
        FILE_CACHE[path] = cached
    return cached


def load_properties(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    out: dict[str, str] = {}
    pending = ""
    logical = ""
    for raw in path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = raw.rstrip("\n")
        if pending:
            logical = pending + line.lstrip()
            pending = ""
        else:
            stripped = line.lstrip()
            if not stripped or stripped.startswith("#") or stripped.startswith("!"):
                continue
            logical = line
        if logical.endswith("\\") and not logical.endswith("\\\\"):
            pending = logical[:-1]
            continue
        key, value = split_prop(logical)
        if key:
            out[key] = decode_prop(value)
    return out


def split_prop(line: str) -> tuple[str, str]:
    escaped = False
    for i, ch in enumerate(line):
        if escaped:
            escaped = False
            continue
        if ch == "\\":
            escaped = True
            continue
        if ch in "=:":
            return line[:i].strip(), line[i + 1 :].lstrip()
        if ch.isspace() and line[:i].strip():
            rest = line[i:].lstrip()
            if rest[:1] in "=:":
                rest = rest[1:].lstrip()
            return line[:i].strip(), rest
    return "", ""


def decode_prop(value: str) -> str:
    out: list[str] = []
    i = 0
    while i < len(value):
        ch = value[i]
        if ch != "\\" or i + 1 >= len(value):
            out.append(ch)
            i += 1
            continue
        nxt = value[i + 1]
        mapping = {"n": "\n", "r": "\r", "t": "\t", "\\": "\\", " ": " "}
        if nxt in mapping:
            out.append(mapping[nxt])
            i += 2
        elif nxt == "u" and i + 5 < len(value):
            try:
                out.append(chr(int(value[i + 2 : i + 6], 16)))
                i += 6
            except ValueError:
                out.append(nxt)
                i += 2
        else:
            out.append(nxt)
            i += 2
    return "".join(out)


def index_classes(service: str, root: Path) -> None:
    java_root = root / "src/main/java"
    if not java_root.exists():
        return
    for path in java_root.rglob("*.java"):
        CLASS_INDEX[service][path.stem].append(path)


def parse_status_map(root: Path) -> dict[str, tuple[int, str]]:
    path = root / "src/main/java/com/giddh/api/config/ExceptionHandlerConfig.java"
    mapping: dict[str, tuple[int, str]] = {}
    if not path.exists():
        return mapping
    text = load_text(path)
    for match in re.finditer(r"@ExceptionHandler\s*\((.*?)\)", text, re.S):
        classes = re.findall(r"(\w+)\.class", match.group(1))
        tail = text[match.end() : match.end() + 1200]
        status_match = re.search(r"HttpStatus\.([A-Z0-9_]+)", tail)
        if not status_match:
            continue
        status = HTTP_STATUS.get(status_match.group(1), (500, status_match.group(1)))
        for name in classes:
            mapping[name] = status
    return mapping


def resolve_message(service: str, key_or_text: str) -> str:
    if not key_or_text:
        return ""
    table = MESSAGES.get(service) or {}
    if key_or_text in table:
        return table[key_or_text]
    return key_or_text


def skip_ws_comments(text: str, i: int) -> int:
    n = len(text)
    while i < n:
        if text.startswith("//", i):
            nl = text.find("\n", i)
            i = n if nl < 0 else nl + 1
            continue
        if text.startswith("/*", i):
            end = text.find("*/", i + 2)
            i = n if end < 0 else end + 2
            continue
        if text[i].isspace():
            i += 1
            continue
        break
    return i


def scan_balanced(text: str, i: int, open_ch: str, close_ch: str) -> int:
    """Return index just after the matching close, starting at open_ch."""
    n = len(text)
    if i >= n or text[i] != open_ch:
        return i
    depth = 0
    while i < n:
        ch = text[i]
        if ch in "\"'":
            i = skip_string(text, i)
            continue
        if text.startswith("//", i) or text.startswith("/*", i):
            i = skip_ws_comments(text, i)
            continue
        if ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    return n


def skip_string(text: str, i: int) -> int:
    quote = text[i]
    i += 1
    n = len(text)
    while i < n:
        if text[i] == "\\":
            i += 2
            continue
        if text[i] == quote:
            return i + 1
        i += 1
    return n


def extract_method(text: str, handler: str, start_line: int) -> str:
    lines = text.splitlines(keepends=True)
    offsets = [0]
    for line in lines:
        offsets.append(offsets[-1] + len(line))
    start = offsets[max(0, start_line - 1)] if start_line else 0
    pattern = re.compile(rf"\b{re.escape(handler)}\s*\(")
    match = pattern.search(text, start)
    if not match:
        match = pattern.search(text)
    if not match:
        return ""
    paren_end = scan_balanced(text, match.end() - 1, "(", ")")
    brace = text.find("{", paren_end)
    if brace < 0:
        return ""
    end = scan_balanced(text, brace, "{", "}")
    return text[match.start() : end]


def find_method_by_name(text: str, name: str) -> str:
    match = re.search(
        rf"(?:public|protected|private)\s+[\w.<>,\s\[\]?]+\s+{re.escape(name)}\s*\(",
        text,
    )
    if not match:
        return ""
    line = text.count("\n", 0, match.start()) + 1
    return extract_method(text, name, line)


def split_args(arg_src: str) -> list[str]:
    args: list[str] = []
    buf: list[str] = []
    i = 0
    n = len(arg_src)
    depth_paren = depth_brace = depth_brack = 0
    while i < n:
        ch = arg_src[i]
        if ch in "\"'":
            j = skip_string(arg_src, i)
            buf.append(arg_src[i:j])
            i = j
            continue
        if ch == "(":
            depth_paren += 1
        elif ch == ")":
            depth_paren -= 1
        elif ch == "{":
            depth_brace += 1
        elif ch == "}":
            depth_brace -= 1
        elif ch == "[":
            depth_brack += 1
        elif ch == "]":
            depth_brack -= 1
        elif ch == "," and depth_paren == depth_brace == depth_brack == 0:
            args.append("".join(buf).strip())
            buf = []
            i += 1
            continue
        buf.append(ch)
        i += 1
    tail = "".join(buf).strip()
    if tail:
        args.append(tail)
    return args


def split_plus(expr: str) -> list[str]:
    parts: list[str] = []
    buf: list[str] = []
    i = 0
    depth = 0
    while i < len(expr):
        ch = expr[i]
        if ch in "\"'":
            j = skip_string(expr, i)
            buf.append(expr[i:j])
            i = j
            continue
        if ch in "([{":
            depth += 1
        elif ch in ")]}":
            depth = max(0, depth - 1)
        elif ch == "+" and depth == 0:
            parts.append("".join(buf).strip())
            buf = []
            i += 1
            continue
        buf.append(ch)
        i += 1
    tail = "".join(buf).strip()
    if tail:
        parts.append(tail)
    return [part for part in parts if part]


def leaf_message(service: str, expr: str) -> str:
    expr = expr.strip()
    key_match = re.search(
        r"(?:StaticMessageSource|MessageUtils)\.getMessage\(\s*\"([^\"]+)\"",
        expr,
    )
    if key_match:
        return resolve_message(service, key_match.group(1))
    literal = re.match(r"^\"((?:\\.|[^\"\\])*)\"\s*$", expr)
    if literal:
        return decode_prop(literal.group(1))
    return ""


def message_from_expr(service: str, expr: str) -> str:
    parts = split_plus(expr.strip())
    if len(parts) > 1:
        return "".join(leaf_message(service, part) or "%s" for part in parts)
    return leaf_message(service, expr)


THROW_NEW_RE = re.compile(r"\bthrow\s+new\s+(\w+)\s*\(")
FACTORY_RE = re.compile(r"\bCustomException\.(e|ec)\s*\(\s*(\w+)\.class\s*,")


def collect_throws(service: str, method_src: str, where: str) -> list[dict[str, Any]]:
    found: list[dict[str, Any]] = []
    if not method_src:
        return found
    i = 0
    while i < len(method_src):
        new_match = THROW_NEW_RE.search(method_src, i)
        factory = FACTORY_RE.search(method_src, i)
        candidates = [m for m in (new_match, factory) if m]
        if not candidates:
            break
        match = min(candidates, key=lambda item: item.start())
        if match.re.pattern.startswith("\\bthrow"):
            exc = match.group(1)
            paren_at = match.end() - 1
            end = scan_balanced(method_src, paren_at, "(", ")")
            args = split_args(method_src[paren_at + 1 : end - 1])
            message = message_from_expr(service, args[0]) if args else ""
            code = message_from_expr(service, args[1]) if len(args) > 1 else ""
        else:
            kind = match.group(1)
            exc = match.group(2)
            paren_at = method_src.rfind("(", 0, match.end())
            # factory starts at CustomException — find the '(' after e/ec
            paren_at = method_src.find("(", match.start())
            end = scan_balanced(method_src, paren_at, "(", ")")
            args = split_args(method_src[paren_at + 1 : end - 1])
            # args[0] is Exception.class
            message = message_from_expr(service, args[1]) if len(args) > 1 else ""
            if kind == "ec":
                key = ""
                key_match = re.search(r"\"([^\"]+)\"", args[1] if len(args) > 1 else "")
                if key_match:
                    key = key_match.group(1)
                code = resolve_message(service, key + ".code") if key else ""
            else:
                code = message_from_expr(service, args[2]) if len(args) > 2 else ""
        i = end
        if not message or not code:
            continue
        if code in SKIP_CODES:
            continue
        if exc in {"InvalidAuthKeyException", "InvalidSessionIdException"}:
            continue
        status = STATUS_MAP.get(service, {}).get(exc, (500, "INTERNAL_SERVER_ERROR"))
        found.append(
            {
                "exception": exc,
                "message": message.strip(),
                "code": code.strip(),
                "httpStatus": status[0],
                "httpStatusName": status[1],
                "where": where,
            }
        )
    return found


def class_fields(text: str) -> dict[str, str]:
    fields: dict[str, str] = {}
    for match in re.finditer(
        r"(?:private|protected)\s+(?:final\s+)?([\w.]+)\s+(\w+)\s*;",
        text,
    ):
        fields[match.group(2)] = match.group(1).split(".")[-1]
    return fields


def calls_in(method_src: str, fields: dict[str, str]) -> list[tuple[str, str, bool]]:
    """Return (fieldType, methodName, in_return) in source order."""
    returns = []
    for match in re.finditer(r"\breturn\b", method_src):
        returns.append(match.start())
    found: list[tuple[str, str, bool]] = []
    for match in re.finditer(r"\b(\w+)\.(\w+)\s*\(", method_src):
        field, method = match.group(1), match.group(2)
        if field not in fields or method in SKIP_CALLS:
            continue
        in_return = any(match.start() - pos < 500 and match.start() > pos for pos in returns)
        found.append((fields[field], method, in_return))
    return found


def pick_class(service: str, simple: str) -> Path | None:
    paths = CLASS_INDEX.get(service, {}).get(simple) or []
    if not paths:
        for other in CLASS_INDEX:
            if CLASS_INDEX[other].get(simple):
                paths = CLASS_INDEX[other][simple]
                break
    if not paths:
        return None

    def rank(path: Path) -> tuple[int, int]:
        text = str(path)
        score = 3
        if "/services/" in text:
            score = 0
        elif "/models/" in text or "/model/" in text:
            score = 1
        elif "/controller" in text:
            score = 2
        return (score, len(text))

    return sorted(paths, key=rank)[0]


def throws_for_method(service: str, class_name: str, method: str, where: str) -> list[dict[str, Any]]:
    key = (f"{service}:{class_name}", method)
    if key in METHOD_CACHE:
        cached = METHOD_CACHE[key]
        return [{**item, "where": where} for item in cached]
    path = pick_class(service, class_name)
    if not path:
        METHOD_CACHE[key] = []
        return []
    body = find_method_by_name(load_text(path), method)
    throws = collect_throws(service, body, where)
    # store without forcing where
    METHOD_CACHE[key] = throws
    return throws


def java_fields(service: str, class_name: str) -> list[tuple[str, str]]:
    path = pick_class(service, class_name)
    if not path:
        return []
    text = load_text(path)
    record = re.search(rf"\brecord\s+{re.escape(class_name)}\s*\((.*?)\)", text, re.S)
    if record:
        fields = []
        for part in split_args(record.group(1)):
            bits = part.split()
            if len(bits) >= 2:
                fields.append((bits[-1], bits[-2]))
        return fields
    fields = []
    for match in re.finditer(
        r"(?:private|protected|public)\s+(?!static\b)(?:final\s+)?([\w.<>,\s\[\]?]+)\s+(\w+)\s*(?:=|;)",
        text,
    ):
        typ = " ".join(match.group(1).split())
        name = match.group(2)
        if name in {"serialVersionUID"} or typ.endswith("Logger"):
            continue
        fields.append((name, typ))
    return fields[:40]


def placeholder(type_name: str) -> Any:
    simple = type_name.split("<", 1)[0].strip().split(".")[-1].replace("[]", "")
    if simple in {"List", "Set", "Collection", "Iterable"} or type_name.endswith("[]"):
        return []
    if simple in {"Map"}:
        return {}
    if simple in {
        "String",
        "Integer",
        "int",
        "Long",
        "long",
        "Double",
        "double",
        "Float",
        "float",
        "Boolean",
        "boolean",
        "BigDecimal",
        "Date",
        "LocalDate",
        "LocalDateTime",
        "Object",
        "UUID",
    }:
        return None
    return {}


def skeleton(service: str, class_name: str) -> Any:
    simple = class_name.split("<", 1)[0].strip().split(".")[-1]
    if simple in {"void", "Void", "Object", "ApiResponse", "ApiResponseSuccess", "?"}:
        return {}
    if placeholder(simple) != {}:
        return placeholder(simple)
    fields = java_fields(service, simple)
    if not fields:
        return {}
    body: dict[str, Any] = {}
    for name, typ in fields:
        body[name] = placeholder(typ)
    return body


def success_body_type(
    service: str, declared: str, method_src: str, fields: dict[str, str]
) -> tuple[str, Any]:
    inner = declared or ""
    generic = re.search(r"ResponseEntity\s*<\s*([^>]+)\s*>", inner)
    if generic:
        inner = generic.group(1).strip()
    inner = inner.replace("?", "").strip() or "Object"
    if inner in {"ApiResponse", "ApiResponseSuccess"}:
        created = re.search(r"new\s+ApiResponseSuccess\s*\(\s*new\s+(\w+)\s*\(", method_src or "")
        if created:
            return created.group(1), skeleton(service, created.group(1))
        literal = re.search(r"new\s+ApiResponseSuccess\s*\(\s*\"([^\"]*)\"", method_src or "")
        if literal:
            return "String", literal.group(1)
        call = re.search(
            r"new\s+ApiResponseSuccess\s*\(\s*(\w+)\.(\w+)\s*\(",
            method_src or "",
        )
        if call:
            return_type = method_return_type(service, call.group(2), fields, call.group(1))
            if return_type:
                return return_type, skeleton(service, return_type)
        return "Object", {}
    return inner.split(".")[-1], skeleton(service, inner)


def method_return_type(service: str, method: str, fields: dict[str, str], field: str) -> str:
    class_name = fields.get(field)
    if not class_name:
        return ""
    path = pick_class(service, class_name)
    if not path:
        return ""
    text = load_text(path)
    match = re.search(
        rf"(?:public|protected|private)\s+([\w.<>,\s\[\]?]+)\s+{re.escape(method)}\s*\(",
        text,
    )
    if not match:
        return ""
    typ = " ".join(match.group(1).split())
    typ = re.sub(r"^[\w.]+\s+", "", typ) if typ.startswith("final ") else typ
    # drop annotations-like prefixes already handled; take last token before method — group is the type
    return typ.split("<", 1)[0].split(".")[-1].strip()


def dedupe(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[tuple[str, str]] = set()
    out = []
    for item in items:
        key = (item["code"], item["message"])
        if key in seen:
            continue
        seen.add(key)
        out.append(item)
    return out


def to_error_example(item: dict[str, Any]) -> dict[str, Any]:
    example = {"status": "error", "code": item["code"], "message": item["message"]}
    return {
        "source": "backend-predicted",
        "httpStatus": item["httpStatus"],
        "httpStatusName": item["httpStatusName"],
        "code": item["code"],
        "message": item["message"],
        "exception": item["exception"],
        "when": item["where"],
        "liveVerified": False,
        "example": example,
    }


def predict_record(record: dict[str, Any]) -> dict[str, Any]:
    service = record.get("service") or ""
    source = record.get("sourceFile") or ""
    handler = record.get("handler") or ""
    root = SERVICE_ROOTS.get(service)
    notes: list[str] = []
    if not root or not source or not handler:
        return {"errors": [], "success": None, "note": "no-source"}
    path = root / source
    if not path.exists():
        return {"errors": [], "success": None, "note": "source-missing"}
    text = load_text(path)
    method_src = extract_method(text, handler, int(record.get("sourceLine") or 1))
    if not method_src:
        return {"errors": [], "success": None, "note": "method-not-found"}
    where = f"{record.get('controller')}.{handler}"
    controller_throws = collect_throws(service, method_src, f"Thrown in {where}")
    fields = class_fields(text)
    primary: list[dict[str, Any]] = []
    other: list[dict[str, Any]] = []
    for class_name, method, in_return in calls_in(method_src, fields):
        thrown = throws_for_method(
            service,
            class_name,
            method,
            f"Thrown in {class_name}.{method} called by {where}",
        )
        if in_return:
            primary.extend(thrown)
        else:
            other.extend(thrown)
    errors = dedupe(controller_throws + primary + other)[:MAX_ERRORS]
    if not errors:
        notes.append("no-throw-site")
    response = record.get("response") or {}
    declared = ""
    if isinstance(response, dict):
        declared = str(response.get("declaredType") or response.get("bodyEvidence") or "")
    body_type, body = success_body_type(service, declared, method_src, fields)
    http = 200
    if isinstance(response, dict) and isinstance(response.get("httpStatus"), int):
        http = response["httpStatus"]
    prepared_success = {
        "source": "backend-predicted",
        "httpStatus": http,
        "bodyType": body_type,
        "liveVerified": False,
        "example": {"status": "success", "body": body},
    }
    return {
        "errors": [to_error_example(item) for item in errors],
        "success": prepared_success,
        "note": notes[0] if notes else "",
    }


def error_key(item: dict[str, Any]) -> tuple[str, str]:
    return (str(item.get("code") or ""), str(item.get("message") or ""))


def apply_prediction(record: dict[str, Any], predicted: dict[str, Any]) -> None:
    response = record.get("response")
    if not isinstance(response, dict):
        response = {}
        record["response"] = response
    existing = [
        item
        for item in (response.get("errorExamples") or [])
        if isinstance(item, dict) and item.get("source") != "backend-predicted"
    ]
    keys = {error_key(item) for item in existing}
    extra = []
    for item in predicted["errors"]:
        if error_key(item) in keys:
            continue
        extra.append(item)
        keys.add(error_key(item))
    response["errorExamples"] = existing + extra
    response["preparedErrors"] = predicted["errors"]
    if predicted["success"]:
        response["preparedSuccess"] = predicted["success"]


def strip_path(path: str) -> str:
    path = (path or "").strip().split("?", 1)[0]
    return path.strip("/")


def path_matches(concrete: str, normalized: str) -> bool:
    c_parts = strip_path(concrete).split("/") if strip_path(concrete) else []
    n_parts = strip_path(normalized).split("/") if strip_path(normalized) else []
    if len(c_parts) != len(n_parts) or not c_parts:
        return False
    for concrete_part, normal_part in zip(c_parts, n_parts):
        if normal_part in ("{}", "*"):
            continue
        if concrete_part != normal_part:
            return False
    return True


def norm_msg(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "").strip()).lower()


def messages_agree(predicted: Any, live: Any) -> bool:
    predicted_text = norm_msg(predicted)
    live_text = norm_msg(live)
    if not predicted_text or not live_text:
        return False
    if predicted_text == live_text:
        return True
    if "%s" not in predicted_text and not re.search(r"\{\d+\}", predicted_text):
        return False
    pattern = re.escape(predicted_text).replace(r"\%s", r".+")
    pattern = re.sub(r"\\\{[0-9]+\\\}", r".+", pattern)
    return re.fullmatch(pattern, live_text) is not None


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def dump_json(path: Path, data: Any) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def verify(records: list[dict[str, Any]]) -> dict[str, Any]:
    by_method: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        if record.get("classification") != "frontend-used":
            continue
        by_method[str(record.get("method") or "").upper()].append(record)
    agreements = 0
    mismatches: list[str] = []
    mismatch_count = 0
    code_misses = 0
    compared = 0
    for req_path in sorted(REQ_DIR.glob("*.json")):
        tag = req_path.stem
        resp_path = RESP_DIR / f"{tag}.json"
        if not resp_path.exists():
            continue
        try:
            req = load_json(req_path)
            resp = load_json(resp_path)
        except json.JSONDecodeError:
            continue
        if not isinstance(req, dict) or not isinstance(resp, dict) or resp.get("status") != "error":
            continue
        method = str(req.get("method") or "").upper()
        concrete = strip_path(str(req.get("path") or ""))
        if not method or not concrete:
            continue
        matches = []
        for record in by_method.get(method, []):
            normalized = record.get("normalizedPath") or ""
            path = re.sub(r"\{[^}]+\}", "{}", strip_path(record.get("path") or ""))
            if path_matches(concrete, normalized) or path_matches(concrete, path):
                matches.append(record)
        if not matches:
            continue
        record = matches[0]
        prepared = (record.get("response") or {}).get("preparedErrors") or []
        code = str(resp.get("code") or "")
        message = str(resp.get("message") or "")
        if code in SKIP_CODES:
            continue
        compared += 1
        same_code = [item for item in prepared if str(item.get("code") or "") == code]
        agreed = [item for item in same_code if messages_agree(item.get("message"), message)]
        if agreed:
            agreements += 1
            for item in agreed:
                item["liveVerified"] = True
                example_list = (record.get("response") or {}).get("errorExamples") or []
                for listed in example_list:
                    if (
                        isinstance(listed, dict)
                        and listed.get("source") == "backend-predicted"
                        and error_key(listed) == error_key(item)
                    ):
                        listed["liveVerified"] = True
            continue
        if same_code:
            mismatch_count += 1
            if len(mismatches) < 40:
                predicted_msg = same_code[0].get("message")
                mismatches.append(
                    f"| `{tag}` | `{record.get('method')} {record.get('path')}` | `{code}` | live `{message[:80]}` | predicted `{str(predicted_msg)[:80]}` |"
                )
        else:
            code_misses += 1
    return {
        "compared": compared,
        "agreements": agreements,
        "mismatches": mismatches,
        "mismatch_count": mismatch_count,
        "code_misses": code_misses,
    }


def write_report(stats: dict[str, Any], verify_stats: dict[str, Any], no_throw: list[str]) -> None:
    lines = [
        "# Predicted success and failure responses",
        "",
        f"Generated {PREDICTED_AT} by `_predict_fe_responses.py`.",
        "",
        "Predicted JSON is read from controller handlers and one level of service calls.",
        "It is not a live capture. Live `successExample` values are left in place.",
        "Shared auth failures (`INVALID_AUTH_KEY`, `INVALID_SESSION`, `INVALID_SESSION_ID`) are not copied onto every route.",
        f"At most {MAX_ERRORS} predicted errors are kept per API (controller throws, then the returned service call, then other calls).",
        "",
        "## Counts",
        "",
        "| | |",
        "| --- | ---: |",
        f"| Frontend-used records | {stats['fe']} |",
        f"| With prepared success | {stats['success']} |",
        f"| With at least one predicted error | {stats['with_errors']} |",
        f"| No concrete throw site | {stats['no_throw']} |",
        f"| Source file missing | {stats['missing']} |",
        f"| Live error captures compared | {verify_stats['compared']} |",
        f"| Code + message agreed | {verify_stats['agreements']} |",
        f"| Same code, different message | {verify_stats['mismatch_count']} ({len(verify_stats['mismatches'])} listed) |",
        f"| Live error code not in the predicted set | {verify_stats['code_misses']} |",
        "",
        "A live error agrees when the code matches and the message matches, including `%s` / `{0}` templates.",
        "Agreements set `liveVerified: true` on that predicted error only.",
        "Success skeletons stay `liveVerified: false`.",
        "",
        "## Message mismatches",
        "",
    ]
    if verify_stats["mismatches"]:
        lines += [
            "| Capture | API | Code | Live message | Predicted message |",
            "| --- | --- | --- | --- | --- |",
            *verify_stats["mismatches"],
            "",
        ]
    else:
        lines += ["None in the compared set.", ""]
    lines += ["## No throw site found", ""]
    if no_throw:
        lines += [f"{len(no_throw)} frontend-used APIs had no resolvable `throw new` message in the handler or one service call.", ""]
        for item in no_throw:
            lines.append(f"- `{item}`")
    else:
        lines.append("None.")
    lines.append("")
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def prepare_indexes() -> None:
    for service, root in SERVICE_ROOTS.items():
        if not root.exists():
            continue
        index_classes(service, root)
        STATUS_MAP[service] = parse_status_map(root)
        messages = root / "src/main/resources/i18n/messages.properties"
        MESSAGES[service] = load_properties(messages)


def annotate(catalog: dict[str, Any]) -> tuple[dict[str, Any], list[str]]:
    stats = {"fe": 0, "success": 0, "with_errors": 0, "no_throw": 0, "missing": 0}
    no_throw: list[str] = []
    for record in catalog.get("records") or []:
        if record.get("classification") != "frontend-used":
            continue
        stats["fe"] += 1
        predicted = predict_record(record)
        apply_prediction(record, predicted)
        if predicted["success"]:
            stats["success"] += 1
        if predicted["errors"]:
            stats["with_errors"] += 1
        if predicted["note"] == "no-throw-site":
            stats["no_throw"] += 1
            no_throw.append(f"{record.get('method')} {record.get('path')}")
        if predicted["note"] in {"source-missing", "no-source", "method-not-found"}:
            stats["missing"] += 1
            no_throw.append(f"{record.get('method')} {record.get('path')} ({predicted['note']})")
    return stats, no_throw


def main() -> None:
    prepare_indexes()
    primary_path = CATALOGS[0]
    catalog = load_json(primary_path)
    stats, no_throw = annotate(catalog)
    verify_stats = verify(catalog["records"])
    dump_json(primary_path, catalog)
    # Copy predicted fields onto the explorer catalog by id so both stay aligned.
    by_id = {record.get("id"): record for record in catalog["records"]}
    explorer = load_json(CATALOGS[1])
    for record in explorer.get("records") or []:
        src = by_id.get(record.get("id"))
        if not src or record.get("classification") != "frontend-used":
            continue
        src_response = src.get("response") or {}
        response = record.setdefault("response", {})
        if not isinstance(response, dict):
            continue
        if "preparedSuccess" in src_response:
            response["preparedSuccess"] = src_response["preparedSuccess"]
        if "preparedErrors" in src_response:
            response["preparedErrors"] = src_response["preparedErrors"]
        if "errorExamples" in src_response:
            response["errorExamples"] = src_response["errorExamples"]
    dump_json(CATALOGS[1], explorer)
    write_report(stats, verify_stats, no_throw)
    print(json.dumps({"stats": stats, "verify": {k: verify_stats[k] if k != "mismatches" else len(verify_stats[k]) for k in verify_stats}}, indent=2))
    print(f"report: {REPORT_PATH}")


if __name__ == "__main__":
    main()
