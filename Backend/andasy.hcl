# andasy.hcl app configuration file generated for yegobackend on Wednesday, 06-Aug-25 16:20:12 SAST
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "yegobackend"

app {

  env = {
    HOST = "::"
  }

  port = 5000

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "yegobackend"
  }

}
