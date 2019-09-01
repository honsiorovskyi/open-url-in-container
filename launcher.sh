#!/bin/sh

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

usage() {
	printf "Usage:\n\n"
	printf "$0 [COLOR] [ICON] [-n|--name NAME|--name=NAME] URL\n"
	printf "$0 URL [COLOR] [ICON] [-n|--name NAME|--name=NAME]\n"
	printf "$0 -h|--help\n\n"
	printf "Where COLOR is one of:\n\t--blue\n\t--turquoise\n\t--green\n\t--yellow\n\t--orange\n\t--red\n\t--pink\n\t--purple\n\n"
	printf "Where ICON is one of:\n\t--fingerprint\n\t--briefcase\n\t--dollar\n\t--cart\n\t--circle\n\t--gift\n\t--vacation\n\t--food\n\t--fruit\n\t--pet\n\t--tree\n\t--chill\n\n"
	printf "If container NAME is not supplied, the domain part of URL will be used as NAME instead.\n"
	exit 1
}

assertOnlyOne() {
	var="$1"
	if [ -n "${!var}" ]
	then
		echo "Error: Only one $var allowed"
		usage
	fi
}

assertRequired() {
	var="$1"
	if [ -z "${!var}" ]
	then
		echo "Error: URL is a required parameter"
		usage
	fi
}

# code from: https://stackoverflow.com/questions/296536/how-to-urlencode-data-for-curl-command
urlencode() {
  local string="${1}"
  local strlen=${#string}
  local encoded=""
  local pos c o

  for (( pos=0 ; pos<strlen ; pos++ )); do
     c=${string:$pos:1}
     case "$c" in
        [-_.~a-zA-Z0-9] ) o="${c}" ;;
        * )               printf -v o '%%%02x' "'$c"
     esac
     encoded+="${o}"
  done
  echo "${encoded}"
}

if [ -z "$FIREFOX" ]
then
	FIREFOX=firefox
fi

while [[ $# -gt 0 ]]
do
	key="$1"
	case $key in
	-h|--help)
		usage
		;;
	-n|--name)
		assertOnlyOne NAME
		NAME="$2"
		shift
		shift
		;;
	--name=*)
		assertOnlyOne NAME
		_name="$1"
		NAME="${_name#--name=}"
		shift
		;;
	--blue|--turquoise|--green|--yellow|--orange|--red|--pink|--purple)
		assertOnlyOne COLOR
		COLOR="${1#--}"
		shift
		;;
	--fingerprint|--briefcase|--dollar|--cart|--circle|--gift|--vacation|--food|--fruit|--pet|--tree|--chill)
		assertOnlyOne ICON
		ICON="${1#--}"
		shift
		;;
	--*|-*)
		echo "Error: Unknown parameter: $1"
		usage
		;;
	*)
		assertOnlyOne URL
		URL="$1"
		shift
		;;
	esac
done

assertRequired URL

if [ -z "$NAME" ]
then
	NAME=${URL#*//} # strip [method:]//
	NAME=${NAME%%/*} # strip path
fi

URL=$(urlencode $URL)

FULL_URL="ext+container:url=${URL}&name=${NAME}"
if [ -n "$COLOR" ]
then
	FULL_URL="${FULL_URL}&color=${COLOR}"
fi
if [ -n "$ICON" ]
then
	FULL_URL="${FULL_URL}&icon=${ICON}"
fi

$FIREFOX $FIREFOX_ARGS "$FULL_URL"