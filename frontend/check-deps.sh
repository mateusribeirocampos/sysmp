#!/bin/bash
DIRNAME=${1:-.}
cd $DIRNAME

FILES=$(mktemp)
PACKAGES=$(mktemp)

# use fd
# https://github.com/sharkdp/fd

function check {
    cat package.json \
        | jq "{} + .$1 | keys" \
        | sed -n 's/.*"\(.*\)".*/\1/p' > $PACKAGES
    echo "--------------------------"
    echo "Checking $1..."
    fd '(js|ts|tsx|jsx|json)$' -t f > $FILES
    while read PACKAGE
    do
        # Replace @ and / with escaped versions for grep
        ESCAPED_PACKAGE=$(echo $PACKAGE | sed 's/\//\\\//g' | sed 's/\@/\\\@/g')
        
        # Special case for @types packages which don't get imported directly
        if [[ $PACKAGE == @types/* ]]; then
            BASE_PACKAGE=$(echo $PACKAGE | sed 's/\@types\///')
            RES=$(cat $FILES | xargs -I {} egrep -i "(import|require|loader|plugins).*['\"]${BASE_PACKAGE}[\"']" '{}' | wc -l)
        else
            # Look for the package name in imports
            RES=$(cat $FILES | xargs -I {} egrep -i "(import|require|loader|plugins).*['\"]${ESCAPED_PACKAGE}[\"'\/]" '{}' | wc -l)
        fi

        if [ $RES = 0 ]
        then
            echo -e "UNUSED\t\t $PACKAGE"
        else
            echo -e "USED ($RES)\t $PACKAGE"
        fi
    done < $PACKAGES
}

check "dependencies"
check "devDependencies"
check "peerDependencies"