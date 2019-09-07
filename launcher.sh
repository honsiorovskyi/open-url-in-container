#!/bin/sh

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

usage() {
	app=$(basename $0)
	printf "$app - open URL in a specific container in Firefox.\n\n"
	printf "Usage:\n"
	printf "\t$app [OPTIONS] URL\n"
	printf "\t$app URL [OPTIONS]\n"
	printf "\t$app -h|--help\n\n"
	printf "Where optional OPTIONS may include any combination of:\n"
	printf "\t--COLOR\t\tcolor for the container (if does not exist)\n"
	printf "\t--ICON\t\ticon for the container (if does not exist)\n"
	printf "  -n,\t--name=NAME\tcontainer name (default: domain part of the URL)\n"
	printf "  -p,\t--pin\t\tpin tab\n"
	printf "  -r,\t--reader\topen tab in the reader mode\n\n"
	printf "Where COLOR is one of:\n\t--blue\n\t--turquoise\n\t--green\n\t--yellow\n\t--orange\n\t--red\n\t--pink\n\t--purple\n\n"
	printf "Where ICON is one of:\n\t--fingerprint\n\t--briefcase\n\t--dollar\n\t--cart\n\t--circle\n\t--gift\n\t--vacation\n\t--food\n\t--fruit\n\t--pet\n\t--tree\n\t--chill\n"
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
	-p|--pin)
		PIN=true
		shift
		;;
	-r|--reader)
		READER_MODE=true
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

if [ -n "$PIN" ]
then
	FULL_URL="${FULL_URL}&pinned=true"
fi

if [ -n "$READER_MODE" ]
then
	FULL_URL="${FULL_URL}&openInReaderMode=true"
fi

$FIREFOX $FIREFOX_ARGS "$FULL_URL"
