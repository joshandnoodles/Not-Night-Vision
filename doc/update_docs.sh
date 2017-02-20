echo
echo "--------------------------------------------"

# desired formats
output_exts=(latex html docx pdf)
src_ext="md"
meta_ext="json"

# define paths and dir naming conventions
doc_path="./"
doc_base="doc"
doc_src_path="."

# define template file and preamble
latex_template=$doc_src_path"/""template_latex_basic.tex"

# first, git rid of old converted docs
echo "Deleting directories of old converted files:"
for i in ${output_exts[@]}; do
  echo -n -e "  "$doc_path$doc_base"_"$i "\t"
  rm --recursive --force $doc_path$doc_base"_"$i
  echo "DONE"
done

echo

# create directories for converted files
echo "Creating directory for output files:"
for i in ${output_exts[@]}; do
  echo -n -e "  "$doc_path$doc_base"_"$i "\t"
  mkdir $doc_path$doc_base"_"$i
  echo "DONE"
done
  
echo

echo

# now actually convert for each desired format
echo "Converting source files:"
for i in $doc_src_path"/"*"."$src_ext; do
  file_name=${i##*/}                # remove path
  file_name=${file_name%.$src_ext}  # remove extension
  echo "  "$i
  echo -e "---" > $doc_path"/temp."$src_ext
  cat $doc_src_path"/"$file_name"."$meta_ext >> $doc_path"/temp."$src_ext
  echo -e "\n---" >> $doc_path"/temp."$src_ext
  cat $i >> $doc_path"/temp."$src_ext
  for j in ${output_exts[@]}; do
    echo -n -e "     "${j^^} "\t"
    if [ "$j" = "pdf" ]
    then
      pandoc $doc_path"temp."$src_ext -o $doc_path$doc_base"_"$j/$file_name"."$j --template=$latex_template --smart --standalone
    else
      pandoc $i -o $doc_path$doc_base"_"$j/$file_name"."$j --template=$latex_template --smart --standalone
    fi
        echo "DONE"
  done
  rm --force $doc_path"/temp."$src_ext
done

echo

read -p "Press [ENTER] exit..."

echo

echo "--------------------------------------------"
echo
