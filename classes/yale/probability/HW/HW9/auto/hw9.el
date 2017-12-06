(TeX-add-style-hook
 "hw9"
 (lambda ()
   (TeX-add-to-alist 'LaTeX-provided-class-options
                     '(("article" "11pt")))
   (TeX-add-to-alist 'LaTeX-provided-package-options
                     '(("inputenc" "utf8") ("fontenc" "T1") ("ulem" "normalem")))
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperref")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperimage")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperbaseurl")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "nolinkurl")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "url")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "path")
   (add-to-list 'LaTeX-verbatim-macros-with-delims-local "path")
   (TeX-run-style-hooks
    "latex2e"
    "article"
    "art11"
    "inputenc"
    "fontenc"
    "graphicx"
    "grffile"
    "longtable"
    "wrapfig"
    "rotating"
    "ulem"
    "amsmath"
    "textcomp"
    "amssymb"
    "capt-of"
    "hyperref")
   (LaTeX-add-labels
    "sec:org379b3f1"
    "sec:org32a3391"
    "sec:org3569c5e"
    "sec:org2699f03"
    "sec:org9d85282"
    "sec:org3e28e9a"
    "sec:orgc51dfb1"
    "sec:org415b827"
    "sec:org4de1921"
    "sec:orgeefd5e0"
    "sec:orge7c39ab"
    "sec:orgddff993"
    "sec:org5bd09a6"
    "sec:org0b31125"
    "sec:org8d63748"
    "sec:org3d49af7"
    "sec:org172972d"))
 :latex)

