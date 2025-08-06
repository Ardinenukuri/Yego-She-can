# andasy.hcl app configuration file generated for yegoshecan on Tuesday, 05-Aug-25 19:31:31 SAST
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "yegoshecan"

app {

  env = {}

  port = 3000

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "yegoshecan"
  }

}
